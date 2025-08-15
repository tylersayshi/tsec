# TypeScript `erasableSyntaxOnly` Codemod

**Disclaimer: This is under very initial development and is not ready at all for
use. Contributions and feedback are very welcome though 🙌**

Hi! This is `tsec`, a third-party codemod tool for automatically migrating your
code to be compatible with TypeScript's
[erasableSyntaxOnly](https://www.typescriptlang.org/tsconfig/#erasableSyntaxOnly)
flag.

The assumptions and opinions related to the changes that will be made are
described in [assumptions.md](./docs/assumptions.md).

## TODO

**Additional mods**

- [ ] namespaces and modules with runtime code
- [x] parameter properties in classes
- [ ] Non-ECMAScript import = and export = assignments
- [x] (insufficient) check support needed for import rewrites:
      [docs](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-7.html#path-rewriting-for-relative-paths)
- [ ] update tsconfig.json (maybe this can just be instructions logged from
      cli): [docs](https://nodejs.org/api/typescript.html#type-stripping)

**Ready for migrating repo's**

- [ ] Handle multiple files with glob input
- [ ] Write a cli for running the codemod with options for picking which
      transformations to run on
- [ ] Support monorepos
