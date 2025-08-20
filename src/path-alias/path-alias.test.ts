import { executeTest } from "../utils/test.ts";
import { pathAliasCodemod } from "./path-alias.ts";

const testFn = await executeTest(import.meta.dirname!, pathAliasCodemod);

Deno.test.only("converts simple path alias to relative path", async () => {
  await testFn({
    testFile: "simple_alias_test.ts",
    inFile: "src/path-alias/spec/simple-alias.in.ts",
    outFile: "src/path-alias/spec/simple-alias.out.ts",
  });
});

Deno.test("converts wildcard path alias to relative path", async () => {
  await testFn({
    testFile: "wildcard_alias_test.ts",
    inFile: "src/path-alias/spec/wildcard-alias.in.ts",
    outFile: "src/path-alias/spec/wildcard-alias.out.ts",
  });
});

Deno.test("handles multiple imports with different aliases", async () => {
  await testFn({
    testFile: "multiple_imports_test.ts",
    inFile: "src/path-alias/spec/multiple-imports.in.ts",
    outFile: "src/path-alias/spec/multiple-imports.out.ts",
  });
});

Deno.test("preserves relative imports unchanged", async () => {
  await testFn({
    testFile: "relative_imports_test.ts",
    inFile: "src/path-alias/spec/relative-imports.in.ts",
    outFile: "src/path-alias/spec/relative-imports.out.ts",
  });
});

Deno.test("preserves external package imports unchanged", async () => {
  await testFn({
    testFile: "external_packages_test.ts",
    inFile: "src/path-alias/spec/external-packages.in.ts",
    outFile: "src/path-alias/spec/external-packages.out.ts",
  });
});

Deno.test("handles complex nested path aliases", async () => {
  await testFn({
    testFile: "nested_aliases_test.ts",
    inFile: "src/path-alias/spec/nested-aliases.in.ts",
    outFile: "src/path-alias/spec/nested-aliases.out.ts",
  });
});

Deno.test("handles mixed import types", async () => {
  await testFn({
    testFile: "mixed_imports_test.ts",
    inFile: "src/path-alias/spec/mixed-imports.in.ts",
    outFile: "src/path-alias/spec/mixed-imports.out.ts",
  });
});

Deno.test("handles type-only imports", async () => {
  await testFn({
    testFile: "type_imports_test.ts",
    inFile: "src/path-alias/spec/type-imports.in.ts",
    outFile: "src/path-alias/spec/type-imports.out.ts",
  });
});

Deno.test("handles default and named imports", async () => {
  await testFn({
    testFile: "default_named_imports_test.ts",
    inFile: "src/path-alias/spec/default-named-imports.in.ts",
    outFile: "src/path-alias/spec/default-named-imports.out.ts",
  });
});

Deno.test("handles re-exports", async () => {
  await testFn({
    testFile: "re_exports_test.ts",
    inFile: "src/path-alias/spec/re-exports.in.ts",
    outFile: "src/path-alias/spec/re-exports.out.ts",
  });
});

Deno.test("handles dynamic imports", async () => {
  await testFn({
    testFile: "dynamic_imports_test.ts",
    inFile: "src/path-alias/spec/dynamic-imports.in.ts",
    outFile: "src/path-alias/spec/dynamic-imports.out.ts",
  });
});

Deno.test("comprehensive path alias transformation", async () => {
  await testFn({
    testFile: "comprehensive_test.ts",
    inFile: "src/path-alias/spec/comprehensive.in.ts",
    outFile: "src/path-alias/spec/comprehensive.out.ts",
  });
});
