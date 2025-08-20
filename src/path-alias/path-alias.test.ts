import { executeTest } from "../utils/test.ts";
import { pathAliasCodemod } from "./path-alias.ts";

const testFn = await executeTest(import.meta.dirname!, pathAliasCodemod);

Deno.test.only("converts simple path alias to relative path", async () => {
  await testFn({
    testFile: "simple_alias_test.ts",
    inFile: "src/path-alias/spec/src/tests/simple-alias.in.ts",
    outFile: "src/path-alias/spec/src/tests/simple-alias.out.ts",
  });
});

Deno.test("converts wildcard path alias to relative path", async () => {
  await testFn({
    testFile: "wildcard_alias_test.ts",
    inFile: "src/path-alias/spec/src/tests/wildcard-alias.in.ts",
    outFile: "src/path-alias/spec/src/tests/wildcard-alias.out.ts",
  });
});

Deno.test("handles multiple imports with different aliases", async () => {
  await testFn({
    testFile: "multiple_imports_test.ts",
    inFile: "src/path-alias/spec/src/tests/multiple-imports.in.ts",
    outFile: "src/path-alias/spec/src/tests/multiple-imports.out.ts",
  });
});

Deno.test("preserves relative imports unchanged", async () => {
  await testFn({
    testFile: "relative_imports_test.ts",
    inFile: "src/path-alias/spec/src/tests/relative-imports.in.ts",
    outFile: "src/path-alias/spec/src/tests/relative-imports.out.ts",
  });
});

Deno.test("preserves external package imports unchanged", async () => {
  await testFn({
    testFile: "external_packages_test.ts",
    inFile: "src/path-alias/spec/src/tests/external-packages.in.ts",
    outFile: "src/path-alias/spec/src/tests/external-packages.out.ts",
  });
});

Deno.test("handles complex nested path aliases", async () => {
  await testFn({
    testFile: "nested_aliases_test.ts",
    inFile: "src/path-alias/spec/src/tests/nested-aliases.in.ts",
    outFile: "src/path-alias/spec/src/tests/nested-aliases.out.ts",
  });
});

Deno.test("handles mixed import types", async () => {
  await testFn({
    testFile: "mixed_imports_test.ts",
    inFile: "src/path-alias/spec/src/tests/mixed-imports.in.ts",
    outFile: "src/path-alias/spec/src/tests/mixed-imports.out.ts",
  });
});

Deno.test("handles type-only imports", async () => {
  await testFn({
    testFile: "type_imports_test.ts",
    inFile: "src/path-alias/spec/src/tests/type-imports.in.ts",
    outFile: "src/path-alias/spec/src/tests/type-imports.out.ts",
  });
});

Deno.test("handles default and named imports", async () => {
  await testFn({
    testFile: "default_named_imports_test.ts",
    inFile: "src/path-alias/spec/src/tests/default-named-imports.in.ts",
    outFile: "src/path-alias/spec/src/tests/default-named-imports.out.ts",
  });
});

Deno.test("handles re-exports", async () => {
  await testFn({
    testFile: "re_exports_test.ts",
    inFile: "src/path-alias/spec/src/tests/re-exports.in.ts",
    outFile: "src/path-alias/spec/src/tests/re-exports.out.ts",
  });
});

Deno.test("handles dynamic imports", async () => {
  await testFn({
    testFile: "dynamic_imports_test.ts",
    inFile: "src/path-alias/spec/src/tests/dynamic-imports.in.ts",
    outFile: "src/path-alias/spec/src/tests/dynamic-imports.out.ts",
  });
});

Deno.test("comprehensive path alias transformation", async () => {
  await testFn({
    testFile: "comprehensive_test.ts",
    inFile: "src/path-alias/spec/src/tests/comprehensive.in.ts",
    outFile: "src/path-alias/spec/src/tests/comprehensive.out.ts",
  });
});
