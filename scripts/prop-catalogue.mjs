#!/usr/bin/env node
/**
 * `pnpm prop-catalogue` — regenerate the prop catalogue of the React library.
 * `pnpm prop-catalogue:check` — fail if the committed catalogue is out of date.
 *
 * The catalogue is the public prop surface of the library, read from the TYPES of what the barrel
 * (`packages/react/src/index.ts`) exports: every component, every part, and for each prop its
 * type, its documented default and whether it is required. Nothing is retyped by hand, and nothing
 * is read from upstream prose: the TypeScript checker is asked what a consumer can actually pass.
 *
 * WHAT THIS CATCHES THAT NOTHING ELSE WOULD.
 * A change to the prop surface is not an error to any other tool. A dependency upgrade that adds,
 * removes or retypes a prop, or changes a default, typechecks and builds. So does a module that
 * starts narrowing or extending what it re-exports. With the catalogue committed and checked, each
 * of those becomes a diff someone has to regenerate and review on purpose.
 *
 * WHAT IT WRITES
 *   packages/react/src/<entry>/<Name>.props.json   one per module: components -> props
 *   packages/react/prop-catalogue.json             the index: counts, and prop name -> where used
 *
 * A prop is listed when at least one of its declarations lives outside `@types/*` and the
 * TypeScript lib — that is, when the library or its behaviour layer declared it. Attributes that
 * exist only because the part renders an HTML element (`onClick`, `aria-*`, `ref`) are not listed.
 *
 * `default` is the prop's `@default` JSDoc tag, verbatim. `null` means none is documented, which
 * is not the same as "has no default" — it records what the source states and nothing more.
 *
 * DETERMINISM. Every list is sorted with a code-point comparator, directory reads are sorted, and
 * a type string that would carry a machine path (`import("C:/...")`) is rewritten to its package
 * path, or the run fails. Output is formatted with the repo's Prettier config, so the check can
 * compare bytes.
 */

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';
import ts from 'typescript';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PKG_DIR = join(REPO_ROOT, 'packages', 'react');
const SRC_DIR = join(PKG_DIR, 'src');
const BARREL = join(SRC_DIR, 'index.ts');
const TSCONFIG = join(PKG_DIR, 'tsconfig.json');
const INDEX_FILE = join(PKG_DIR, 'prop-catalogue.json');
const PROPS_SUFFIX = '.props.json';
const SCHEMA_VERSION = '1.0';

const check = process.argv.includes('--check');

const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const posix = (p) => p.split(String.fromCharCode(92)).join('/');
const rel = (p) => posix(relative(REPO_ROOT, p));
const sortKeys = (obj) =>
  Object.fromEntries(
    Object.keys(obj)
      .sort(cmp)
      .map((key) => [key, obj[key]]),
  );

function fail(message) {
  console.error(`prop-catalogue failed — ${message}`);
  process.exit(1);
}

// ── program ────────────────────────────────────────────────────────────────

function createProgram() {
  const parsed = ts.getParsedCommandLineOfConfigFile(
    TSCONFIG,
    {},
    {
      ...ts.sys,
      onUnRecoverableConfigFileDiagnostic: (d) =>
        fail(ts.flattenDiagnosticMessageText(d.messageText, '\n')),
    },
  );
  return ts.createProgram({ rootNames: [BARREL], options: parsed.options });
}

// ── type strings ───────────────────────────────────────────────────────────

/**
 * Split a printed type on its top-level `|`. Stops at a top-level `=>`: everything after it is a
 * return type, and a union there belongs to the function, not to the prop.
 */
function splitUnion(text) {
  const parts = [];
  let depth = 0;
  let quote = null;
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quote) {
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') quote = ch;
    else if (ch === '=' && text[i + 1] === '>') {
      if (depth === 0) break;
      i++;
    } else if (ch === '(' || ch === '[' || ch === '{' || ch === '<') depth++;
    else if (ch === ')' || ch === ']' || ch === '}' || ch === '>') depth--;
    else if (ch === '|' && depth === 0) {
      parts.push(text.slice(start, i).trim());
      start = i + 1;
    }
  }
  parts.push(text.slice(start).trim());
  return parts.filter(Boolean);
}

/** `import("<machine path>/node_modules/pkg/file")` -> `import("pkg/file")`. */
function portable(text, where) {
  const out = text.replace(/import\("([^"]+)"\)/g, (_, p) => {
    const at = p.lastIndexOf('node_modules/');
    if (at !== -1) return `import("${p.slice(at + 'node_modules/'.length)}")`;
    if (posix(p).startsWith(posix(REPO_ROOT))) return `import("${rel(p)}")`;
    return `import("${p}")`;
  });
  if (out.includes(posix(REPO_ROOT)) || /import\("(\/|[A-Za-z]:)/.test(out))
    fail(`${where}: the type carries a machine-specific path and cannot be committed:\n  ${out}`);
  return out;
}

// ── scanning ───────────────────────────────────────────────────────────────

const isExternalDeclaration = (declaration) => {
  const file = posix(declaration.getSourceFile().fileName);
  return file.includes('/node_modules/@types/') || file.includes('/node_modules/typescript/');
};

/** The props a consumer can pass to a callable export, or `null` when it is not a component. */
function readProps(checker, symbol, name, at, where) {
  if (!/^[A-Z]/.test(name)) return null;
  if (!(symbol.flags & ts.SymbolFlags.Value)) return null;
  const signatures = checker.getTypeOfSymbolAtLocation(symbol, at).getCallSignatures();
  if (!signatures.length) return null;

  // A component may have several signatures, and its props may be a union of shapes. Every shape
  // counts: a prop that exists on only one of them is still something a consumer can pass.
  const shapes = [];
  for (const signature of signatures) {
    const [first] = signature.getParameters();
    if (!first) {
      shapes.push([]);
      continue;
    }
    const type = checker.getTypeOfSymbolAtLocation(first, at);
    for (const member of type.isUnion() ? type.types : [type])
      shapes.push(checker.getPropertiesOfType(checker.getApparentType(member)));
  }

  const merged = new Map();
  for (const shape of shapes) {
    for (const prop of shape) {
      const declarations = prop.getDeclarations() ?? [];
      if (declarations.length && declarations.every(isExternalDeclaration)) continue;

      const optional = Boolean(prop.flags & ts.SymbolFlags.Optional);
      const printed = checker.typeToString(
        checker.getTypeOfSymbolAtLocation(prop, at),
        undefined,
        ts.TypeFormatFlags.NoTruncation,
      );
      const members = splitUnion(portable(printed, `${where}.${prop.name}`));
      const kept = optional ? members.filter((m) => m !== 'undefined') : members;
      const tag = prop.getJsDocTags(checker).find((t) => t.name === 'default');
      const def = tag ? ts.displayPartsToString(tag.text).trim() : null;

      const entry = merged.get(prop.name) ?? { types: new Set(), defaults: new Set(), seen: 0 };
      entry.types.add((kept.length ? kept : members).join(' | '));
      if (def !== null && def !== '') entry.defaults.add(def);
      entry.required = (entry.required ?? true) && !optional;
      entry.seen++;
      merged.set(prop.name, entry);
    }
  }

  const props = {};
  for (const name of [...merged.keys()].sort(cmp)) {
    const entry = merged.get(name);
    const defaults = [...entry.defaults].sort(cmp);
    props[name] = {
      type: [...entry.types].sort(cmp).join(' | '),
      default: defaults.length ? defaults.join(' | ') : null,
      // Required only when every shape of the props has it and none marks it optional.
      required: entry.required && entry.seen === shapes.length,
    };
  }
  return props;
}

/**
 * The exports of a module that exist at runtime. `getExportsOfModule` also returns what
 * `export type *` re-exports, and those names resolve to a component declaration without being
 * importable as one. So the export statements are walked instead, skipping every type-only one.
 */
function valueExports(checker, moduleSymbol) {
  const names = new Set();
  const visited = new Set();
  const hasExport = (node) =>
    ts.canHaveModifiers(node) &&
    (ts.getModifiers(node) ?? []).some((m) => m.kind === ts.SyntaxKind.ExportKeyword);

  const visit = (symbol) => {
    for (const declaration of symbol?.declarations ?? []) {
      if (!ts.isSourceFile(declaration) || visited.has(declaration)) continue;
      visited.add(declaration);
      for (const statement of declaration.statements) {
        if (ts.isExportDeclaration(statement)) {
          if (statement.isTypeOnly) continue;
          const clause = statement.exportClause;
          if (!clause) visit(checker.getSymbolAtLocation(statement.moduleSpecifier));
          else if (ts.isNamespaceExport(clause)) names.add(clause.name.text);
          else for (const e of clause.elements) if (!e.isTypeOnly) names.add(e.name.text);
        } else if (ts.isVariableStatement(statement) && hasExport(statement)) {
          for (const d of statement.declarationList.declarations)
            if (ts.isIdentifier(d.name)) names.add(d.name.text);
        } else if (
          (ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement)) &&
          statement.name &&
          hasExport(statement)
        ) {
          names.add(statement.name.text);
        } else if (
          // `export import Root = Base.Root;` — how a parts module passes a Base UI part through
          // with its type namespace intact. It is a runtime export like any other.
          ts.isImportEqualsDeclaration(statement) &&
          !statement.isTypeOnly &&
          hasExport(statement)
        ) {
          names.add(statement.name.text);
        }
      }
    }
  };
  visit(moduleSymbol);
  return checker.getExportsOfModule(moduleSymbol).filter((s) => names.has(s.name));
}

/** Every module the barrel re-exports, with the components found in it. */
function scan() {
  const program = createProgram();
  const checker = program.getTypeChecker();
  const barrel = program.getSourceFile(BARREL);
  if (!barrel) fail(`${rel(BARREL)} is not part of the program.`);

  const modules = [];
  for (const statement of barrel.statements) {
    const isStar =
      ts.isExportDeclaration(statement) && statement.moduleSpecifier && !statement.exportClause;
    if (!isStar) {
      const { line } = barrel.getLineAndCharacterOfPosition(statement.getStart());
      fail(
        `${rel(BARREL)}:${line + 1} is not an \`export * from\` line. The barrel is one such line ` +
          `per module (ADR 0005); the catalogue reads the public surface from exactly those.`,
      );
    }
    const moduleSymbol = checker.getSymbolAtLocation(statement.moduleSpecifier);
    const file = moduleSymbol?.declarations?.[0]?.getSourceFile().fileName;
    if (!moduleSymbol || !file) fail(`cannot resolve ${statement.moduleSpecifier.getText()}.`);
    if (posix(dirname(dirname(file))) !== posix(SRC_DIR))
      fail(`${rel(file)} is not at packages/react/src/<entry>/<Name> (ADR 0005).`);

    const entry = posix(relative(SRC_DIR, dirname(file)));
    const fileName = posix(relative(dirname(file), file)).replace(/\.tsx?$/, '');
    const components = {};

    for (const exported of valueExports(checker, moduleSymbol)) {
      const target =
        exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
      const own = readProps(checker, target, exported.name, barrel, exported.name);
      if (own) {
        components[exported.name] = { props: own };
        continue;
      }
      // Not callable: a namespace of parts (`Switch.Root`, `Switch.Thumb`) or nothing of ours.
      if (!(target.flags & ts.SymbolFlags.Module)) continue;
      for (const part of valueExports(checker, target)) {
        const partTarget =
          part.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(part) : part;
        const qualified = `${exported.name}.${part.name}`;
        const props = readProps(checker, partTarget, part.name, barrel, qualified);
        if (props) components[qualified] = { props };
      }
    }
    modules.push({ entry, fileName, components: sortKeys(components) });
  }

  const seen = new Set();
  for (const m of modules) {
    if (seen.has(m.entry)) fail(`two barrel lines resolve to packages/react/src/${m.entry}/.`);
    seen.add(m.entry);
  }
  return modules.sort((a, b) => cmp(a.entry, b.entry));
}

// ── rendering ──────────────────────────────────────────────────────────────

function readVersion(...segments) {
  const file = join(...segments, 'package.json');
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')).version : null;
}

async function render(modules) {
  const files = new Map(); // absolute path -> content
  const usedOn = new Map(); // prop name -> component names
  let componentCount = 0;
  let rowCount = 0;

  for (const m of modules) {
    const names = Object.keys(m.components);
    if (!names.length) continue;
    componentCount += names.length;
    for (const name of names) {
      for (const prop of Object.keys(m.components[name].props)) {
        rowCount++;
        if (!usedOn.has(prop)) usedOn.set(prop, []);
        usedOn.get(prop).push(name);
      }
    }
    files.set(join(SRC_DIR, m.entry, m.fileName + PROPS_SUFFIX), {
      _doc: 'GENERATED by `pnpm prop-catalogue` from the types this module exports. Do not edit; `pnpm prop-catalogue:check` fails when it drifts.',
      _schema: SCHEMA_VERSION,
      module: m.entry,
      components: m.components,
    });
  }

  const withComponents = modules.filter((m) => Object.keys(m.components).length);
  files.set(INDEX_FILE, {
    _doc: 'GENERATED by `pnpm prop-catalogue`. The index of the prop catalogue: which module files exist, and which components take each prop. Types, defaults and required flags are in the per-module files. Do not edit; `pnpm prop-catalogue:check` fails when it drifts.',
    _schema: SCHEMA_VERSION,
    source: {
      _doc: 'The versions the types were read with. A printed type can change with either.',
      '@base-ui/react': readVersion(PKG_DIR, 'node_modules', '@base-ui', 'react'),
      typescript: ts.version,
    },
    counts: {
      modules: modules.length,
      components: componentCount,
      distinctProps: usedOn.size,
      propRows: rowCount,
    },
    modules: Object.fromEntries(
      withComponents.map((m) => [
        m.entry,
        {
          file: rel(join(SRC_DIR, m.entry, m.fileName + PROPS_SUFFIX)),
          components: Object.keys(m.components),
        },
      ]),
    ),
    modulesWithoutComponents: modules
      .filter((m) => !Object.keys(m.components).length)
      .map((m) => m.entry),
    props: Object.fromEntries(
      [...usedOn.keys()].sort(cmp).map((name) => [name, usedOn.get(name).sort(cmp)]),
    ),
  });

  const out = new Map();
  for (const [file, data] of files) {
    const config = (await prettier.resolveConfig(file)) ?? {};
    out.set(file, await prettier.format(JSON.stringify(data), { ...config, filepath: file }));
  }
  return out;
}

/** Every `*.props.json` already on disk, so a file whose module is gone is reported. */
function existingPropsFiles() {
  const found = [];
  for (const entry of readdirSync(SRC_DIR).sort(cmp)) {
    const dir = join(SRC_DIR, entry);
    if (!statSync(dir).isDirectory()) continue;
    for (const f of readdirSync(dir).sort(cmp))
      if (f.endsWith(PROPS_SUFFIX)) found.push(join(dir, f));
  }
  return found;
}

// ── diff, for a failure someone can act on ─────────────────────────────────

function describeDrift(file, before, after) {
  const lines = [];
  let a;
  try {
    a = JSON.parse(before);
  } catch {
    return [`${rel(file)}: is not valid JSON`];
  }
  const b = JSON.parse(after);
  if (file === INDEX_FILE) {
    for (const key of Object.keys(b.source))
      if (key !== '_doc' && a.source?.[key] !== b.source[key])
        lines.push(`source ${key}: ${a.source?.[key] ?? 'none'} -> ${b.source[key]}`);
    return lines.length ? lines : [`${rel(file)}: the index differs`];
  }
  const ca = a.components ?? {};
  const cb = b.components ?? {};
  for (const name of [...new Set([...Object.keys(ca), ...Object.keys(cb)])].sort(cmp)) {
    if (!ca[name]) lines.push(`+ ${name} (component not in the catalogue)`);
    else if (!cb[name]) lines.push(`- ${name} (component no longer exported)`);
    else {
      const pa = ca[name].props ?? {};
      const pb = cb[name].props ?? {};
      for (const prop of [...new Set([...Object.keys(pa), ...Object.keys(pb)])].sort(cmp)) {
        if (!pa[prop]) lines.push(`+ ${name} · ${prop}`);
        else if (!pb[prop]) lines.push(`- ${name} · ${prop}`);
        else
          for (const field of ['type', 'default', 'required'])
            if (pa[prop][field] !== pb[prop][field])
              lines.push(
                `~ ${name} · ${prop} · ${field}: ${JSON.stringify(pa[prop][field])} -> ${JSON.stringify(pb[prop][field])}`,
              );
      }
    }
  }
  return lines.length ? lines : [`${rel(file)}: differs in formatting or metadata only`];
}

// ── run ────────────────────────────────────────────────────────────────────

const modules = scan();
const expected = await render(modules);
const stale = existingPropsFiles().filter((f) => !expected.has(f));
const index = JSON.parse(expected.get(INDEX_FILE));
const summary =
  `${index.counts.components} component(s) in ${Object.keys(index.modules).length} module(s), ` +
  `${index.counts.distinctProps} distinct prop(s), ${index.counts.propRows} prop row(s)`;

if (check) {
  const problems = [];
  for (const [file, content] of expected) {
    if (!existsSync(file)) problems.push([`${rel(file)}: missing`]);
    else {
      const current = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
      if (current !== content) problems.push(describeDrift(file, current, content));
    }
  }
  for (const file of stale) problems.push([`${rel(file)}: no module produces this file any more`]);

  if (problems.length) {
    const lines = problems.flat();
    const LIMIT = 60;
    console.error('prop-catalogue:check failed — the catalogue does not match the types.\n');
    for (const line of lines.slice(0, LIMIT)) console.error(`  ${line}`);
    if (lines.length > LIMIT) console.error(`  … and ${lines.length - LIMIT} more`);
    console.error(
      '\nIf the change to the prop surface is intended, run `pnpm prop-catalogue` and commit ' +
        'the result.',
    );
    process.exit(1);
  }
  console.log(`prop-catalogue:check OK — ${summary}.`);
} else {
  let written = 0;
  for (const [file, content] of expected) {
    const current = existsSync(file) ? readFileSync(file, 'utf8').replace(/\r\n/g, '\n') : null;
    if (current === content) continue;
    writeFileSync(file, content);
    written++;
  }
  for (const file of stale) rmSync(file);
  console.log(
    `prop-catalogue — ${summary}. ` +
      (written || stale.length
        ? `Wrote ${written} file(s), removed ${stale.length}.`
        : 'Already current.'),
  );
}
