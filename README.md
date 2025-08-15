# TypeScript `erasableSyntaxOnly` Codemod

**Disclaimer: This is under very initial development and is not ready at all for
use. Contributions and feedback are very welcome though 🙌**

Hi! This is `tsec`, a third-party codemod tool for automatically migrating your
code to be compatible with TypeScript's
[erasableSyntaxOnly](https://www.typescriptlang.org/tsconfig/#erasableSyntaxOnly)
flag.

The assumptions and opinions related to the changes that will be made are
described in [assumptions.md](./docs/assumptions.md).

## Not supported

I'm personally unaware of scenarios where either of these would be intentionally
included patterns, so am taking the approach of leaving them for typescript to
error on. If however you'll need a codemod from one of these, please feel free
to [make an issue](https://github.com/tylersayshi/tsec/issues/new).

- namespaces and modules with runtime code
- Non-ECMAScript import = and export = assignments

```ts
// ❌ error: An `import ... = require(...)` alias
import foo = require("foo");
// ❌ error: A namespace with runtime code.
namespace container {
  foo.method();
  export type Bar = string;
}
// ❌ error: An `import =` alias
import Bar = container.Bar;
```

## TODO

**Additional mods**

- [ ] path alias rewrite
- [ ] relativePath rewrite from .js, .cjs, .mjs, or from no extension (.ts,
      .cts, and .mts can stay the same)

**Ready for migrating repo's**

- [ ] Handle multiple files with glob input
- [ ] Write a cli for running the codemod with options for picking which
      transformations to run on
- [ ] CLI should warn about tsconfig updates and docs to be aware of
  - https://nodejs.org/api/typescript.html#type-stripping
- [ ] CLI about how to fix imports for `verbatimModuleSyntax`
  - opting not to support this to encourage the use of auto-fixing lint rules
  - https://typescript-eslint.io/rules/consistent-type-imports
  - https://biomejs.dev/linter/rules/use-import-type/
- [ ] Support monorepos
