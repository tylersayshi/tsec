import { executeProjectTest, executeTest } from "../utils/test.ts";
import { enumCodemod } from "./enum.ts";

const testFn = executeTest({
  testDir: "src/enum/spec/",
  codemod: enumCodemod,
});

const projectTestFn = executeProjectTest({
  testDir: "src/enum/spec/",
  codemod: enumCodemod,
});

Deno.test("converts string enum to object", async () => {
  await testFn("string-enum");
});

Deno.test("converts numeric enum to object", async () => {
  await testFn("numeric-enum");
});

Deno.test("converts auto-incrementing enum to object", async () => {
  await testFn("auto-enum");
});

Deno.test("converts mixed value enum to object", async () => {
  await testFn("mixed-enum");
});

Deno.test("converts multiple enums in single file", async () => {
  await testFn("multiple-enums");
});

Deno.test("preserves enum usage in complex scenarios", async () => {
  await testFn("complex-usage");
});

Deno.test("handles const enum conversion", async () => {
  await testFn("const-enum");
});

Deno.test("preserves comments", async () => {
  await testFn("comments");
});

Deno.test("comprehensive enum transformation - full sample", async () => {
  await testFn("comprehensive");
});

Deno.test("enum usage in destructuring and object patterns", async () => {
  await testFn("object-patterns");
});

Deno.test("enum usage in template literals and conditionals", async () => {
  await testFn("template-literal");
});

Deno.test("enum usage with arrays, maps and complex data structures", async () => {
  await testFn("data-structures");
});

Deno.test.only(
  "converts enums across multiple files with imports",
  async () => {
    await projectTestFn("proj");
  },
);
