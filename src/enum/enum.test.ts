import { executeTest } from "../utils/test.ts";
import { enumCodemod } from "./enum.ts";

const testFn = executeTest(enumCodemod);

Deno.test("converts string enum to object", async () => {
  await testFn({
    testFile: "tmp/string_enum_test.ts",
    inFile: "src/enum/spec/string-enum.in.ts",
    outFile: "src/enum/spec/string-enum.out.ts",
  });
});

Deno.test("converts numeric enum to object", async () => {
  await testFn({
    testFile: "tmp/numeric_enum_test.ts",
    inFile: "src/enum/spec/numeric-enum.in.ts",
    outFile: "src/enum/spec/numeric-enum.out.ts",
  });
});

Deno.test("converts auto-incrementing enum to object", async () => {
  await testFn({
    testFile: "tmp/auto_enum_test.ts",
    inFile: "src/enum/spec/auto-enum.in.ts",
    outFile: "src/enum/spec/auto-enum.out.ts",
  });
});

Deno.test("converts mixed value enum to object", async () => {
  await testFn({
    testFile: "tmp/mixed_enum_test.ts",
    inFile: "src/enum/spec/mixed-enum.in.ts",
    outFile: "src/enum/spec/mixed-enum.out.ts",
  });
});

Deno.test("converts multiple enums in single file", async () => {
  await testFn({
    testFile: "tmp/multiple_enums_test.ts",
    inFile: "src/enum/spec/multiple-enums.in.ts",
    outFile: "src/enum/spec/multiple-enums.out.ts",
  });
});

Deno.test("preserves enum usage in complex scenarios", async () => {
  await testFn({
    testFile: "tmp/complex_usage_test.ts",
    inFile: "src/enum/spec/complex-usage.in.ts",
    outFile: "src/enum/spec/complex-usage.out.ts",
  });
});

Deno.test("handles const enum conversion", async () => {
  await testFn({
    testFile: "tmp/const_enum_test.ts",
    inFile: "src/enum/spec/const-enum.in.ts",
    outFile: "src/enum/spec/const-enum.out.ts",
  });
});

Deno.test("preserves comments", async () => {
  await testFn({
    testFile: "tmp/comments_test.ts",
    inFile: "src/enum/spec/comments.in.ts",
    outFile: "src/enum/spec/comments.out.ts",
  });
});

Deno.test("comprehensive enum transformation - full sample", async () => {
  await testFn({
    testFile: "tmp/comprehensive_sample.ts",
    inFile: "src/enum/spec/comprehensive.in.ts",
    outFile: "src/enum/spec/comprehensive.out.ts",
  });
});

Deno.test("enum usage in destructuring and object patterns", async () => {
  await testFn({
    testFile: "tmp/destructuring_test.ts",
    inFile: "src/enum/spec/object-patterns.in.ts",
    outFile: "src/enum/spec/object-patterns.out.ts",
  });
});

Deno.test("enum usage in template literals and conditionals", async () => {
  await testFn({
    testFile: "tmp/templates_conditionals_test.ts",
    inFile: "src/enum/spec/template-literal.in.ts",
    outFile: "src/enum/spec/template-literal.out.ts",
  });
});

Deno.test("enum usage with arrays, maps and complex data structures", async () => {
  await testFn({
    testFile: "tmp/data_structures_test.ts",
    inFile: "src/enum/spec/data-structures.in.ts",
    outFile: "src/enum/spec/data-structures.out.ts",
  });
});
