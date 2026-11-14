// A CSS Module's default export is its class map. Vite provides the behaviour; this is the type.
declare module '*.module.css' {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}
