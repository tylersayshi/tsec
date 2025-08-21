import { executeTest } from "../utils/test.ts";
import { pathAliasCodemod } from "./path-alias.ts";

const testFn = executeTest({
  testDir: "src/path-alias/spec/src/tests/",
  codemod: pathAliasCodemod,
  // flag to ignore missing extensions
  checkTsOptions: ["--unstable-sloppy-imports"],
});

Deno.test("converts simple path alias to relative path", async () => {
  await testFn("simple-alias");
});

Deno.test("handles multiple imports with different aliases", async () => {
  await testFn("multiple-imports");
});

Deno.test("preserves relative imports unchanged", async () => {
  await testFn("relative-imports");
});

Deno.test("preserves external package imports unchanged", async () => {
  await testFn("external-packages");
});

Deno.test("handles complex nested path aliases", async () => {
  await testFn("nested-aliases");
});

Deno.test("handles mixed import types", async () => {
  await testFn("mixed-imports");
});

Deno.test("handles type-only imports", async () => {
  await testFn("type-imports");
});

Deno.test("handles default and named imports", async () => {
  await testFn("default-named-imports");
});

Deno.test("handles re-exports", async () => {
  await testFn("re-exports");
});

Deno.test("handles dynamic imports", async () => {
  await testFn("dynamic-imports");
});

Deno.test("comprehensive path alias transformation", async () => {
  await testFn("comprehensive");
});

Deno.test("preserves .js extensions in path aliases", async () => {
  await testFn("js-extensions");
});

Deno.test("preserves .ts extensions in path aliases", async () => {
  await testFn("ts-extensions");
});

Deno.test.only(
  "resolves alias priority collision for @/* to src/*",
  async () => {
    await testFn("alias-priority-collision");
  },
);
