#!/usr/bin/env node
/**
 * `pnpm --filter @ds/tokens build` — write `build/tokens.css` from the token source files.
 *
 * Reads `tokens/tokens.resolver.json` and emits ONE stylesheet of CSS custom properties:
 *
 *   :root                          every token of every set, in resolver order
 *   :root, [data-<p>-<mod>='<default>']   the default context of each modifier
 *   [data-<p>-<mod>='<context>']   every other context
 *
 * A token path becomes `--<tokenPrefix>-<path joined with ->`. A reference stays a reference:
 * `{color.blue.800}` is emitted as `var(--<tokenPrefix>-color-blue-800)`, never as its resolved
 * value, so the stylesheet keeps the tier structure of the source. See ADR 0009.
 *
 * WHAT THIS CATCHES THAT NOTHING ELSE WOULD. The token files are valid JSON whatever they say, so
 * these pass every other check. Each one throws here, and the build exits non-zero:
 *   - a reference to a token that no set declares
 *   - two contexts of one modifier that declare different token paths
 *   - a `$value` whose shape this script does not know how to print
 *   - two tokens that would produce the same custom-property name
 *
 * DETERMINISM. Order is the order of the resolver document and of the keys in each file; nothing
 * is read from a directory listing. The prefixes come from `/ds.config.json` and are never typed
 * here. No date, path or machine detail is written to the output.
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PKG_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = resolve(PKG_DIR, '..', '..');
const TOKENS_DIR = join(PKG_DIR, 'tokens');
const OUT_FILE = join(PKG_DIR, 'build', 'tokens.css');

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));

const { tokenPrefix, dataPrefix } = readJson(join(REPO_ROOT, 'ds.config.json'));
const resolver = readJson(join(TOKENS_DIR, 'tokens.resolver.json'));

const fail = (message) => {
  throw new Error(`tokens build: ${message}`);
};

/** Flatten one token file to `[path, $value]` pairs, in source order. */
function readTokens(fileName) {
  const out = [];
  const walk = (node, path) => {
    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith('$')) continue;
      if (value === null || typeof value !== 'object') {
        fail(`${fileName}: "${[...path, key].join('.')}" is not a token or a group`);
      }
      if ('$value' in value) out.push([[...path, key].join('.'), value.$value]);
      else walk(value, [...path, key]);
    }
  };
  walk(readJson(join(TOKENS_DIR, fileName)), []);
  return out;
}

const readSources = (sources) => sources.flatMap((source) => readTokens(source.$ref));

const propertyName = (path) => `--${tokenPrefix}-${path.split('.').join('-')}`;

const REFERENCE = /^\{([^{}]+)\}$/;

function printColor(value, where) {
  if (typeof value.hex !== 'string' || !/^#[0-9a-f]{6}$/i.test(value.hex)) {
    fail(`${where}: a colour needs a 6-digit "hex"`);
  }
  if (value.alpha === undefined || value.alpha === 1) return value.hex.toLowerCase();
  const channel = (index) => parseInt(value.hex.slice(1 + index * 2, 3 + index * 2), 16);
  return `rgb(${channel(0)} ${channel(1)} ${channel(2)} / ${value.alpha})`;
}

function printValue(value, where, declared) {
  if (typeof value === 'string') {
    const reference = REFERENCE.exec(value);
    if (!reference) fail(`${where}: "${value}" is neither a reference nor a known value`);
    if (!declared.has(reference[1])) fail(`${where}: reference to undeclared token ${value}`);
    return `var(${propertyName(reference[1])})`;
  }
  if (typeof value === 'number') return String(value);
  if (value && typeof value === 'object') {
    if ('hex' in value) return printColor(value, where);
    if (typeof value.value === 'number' && typeof value.unit === 'string') {
      return `${value.value}${value.unit}`;
    }
  }
  return fail(`${where}: unsupported $value ${JSON.stringify(value)}`);
}

// ---------------------------------------------------------------------------------------------

const setTokens = Object.values(resolver.sets).flatMap((set) => readSources(set.sources));

const modifiers = Object.entries(resolver.modifiers).map(([name, modifier]) => {
  const contexts = Object.entries(modifier.contexts).map(([context, sources]) => ({
    context,
    tokens: readSources(sources),
  }));
  const paths = (tokens) => tokens.map(([path]) => path).join('\n');
  const first = contexts[0];
  if (!first) fail(`modifier "${name}" has no context`);
  for (const other of contexts) {
    if (paths(other.tokens) !== paths(first.tokens)) {
      fail(
        `modifier "${name}": contexts "${first.context}" and "${other.context}" do not declare ` +
          'the same token paths in the same order',
      );
    }
  }
  if (!(modifier.default in modifier.contexts)) {
    fail(`modifier "${name}": default "${modifier.default}" is not one of its contexts`);
  }
  return { name, defaultContext: modifier.default, contexts };
});

// Every path a reference may point at, and a check that no two paths print the same property.
const declared = new Set();
const seenProperties = new Map();
const declare = (path) => {
  const property = propertyName(path);
  const previous = seenProperties.get(property);
  if (previous !== undefined && previous !== path) {
    fail(`"${previous}" and "${path}" both print as ${property}`);
  }
  seenProperties.set(property, path);
  declared.add(path);
};
for (const [path] of setTokens) {
  if (declared.has(path)) fail(`"${path}" is declared by more than one set source`);
  declare(path);
}
for (const modifier of modifiers) {
  for (const [path] of modifier.contexts[0].tokens) {
    if (declared.has(path))
      fail(`"${path}" is declared by a set and by modifier "${modifier.name}"`);
    declare(path);
  }
}

const block = (selector, tokens, where) =>
  [
    `${selector} {`,
    ...tokens.map(
      ([path, value]) =>
        `  ${propertyName(path)}: ${printValue(value, `${where} ${path}`, declared)};`,
    ),
    '}',
  ].join('\n');

const blocks = [block(':root', setTokens, 'sets')];
for (const { name, defaultContext, contexts } of modifiers) {
  for (const { context, tokens } of contexts) {
    const attribute = `[data-${dataPrefix}-${name}='${context}']`;
    const selector = context === defaultContext ? `:root,\n${attribute}` : attribute;
    blocks.push(block(selector, tokens, `${name}=${context}`));
  }
}

const header =
  '/* GENERATED by packages/tokens/scripts/build.mjs from packages/tokens/tokens/. Do not edit. */';
const css = `${header}\n\n${blocks.join('\n\n')}\n`;

mkdirSync(dirname(OUT_FILE), { recursive: true });
writeFileSync(OUT_FILE, css);

const count = setTokens.length + modifiers.reduce((sum, m) => sum + m.contexts[0].tokens.length, 0);
console.log(`tokens build: ${count} custom properties -> build/tokens.css`);
