import { executeTest } from "../utils/test.ts";
import { parameterPropertiesCodemod } from "./parameter-properties.ts";

const testFn = executeTest(
  {
    testDir: "src/parameter-properties/spec/",
    codemod: parameterPropertiesCodemod,
  },
);

Deno.test("converts public parameter properties", async () => {
  await testFn("public-params");
});

Deno.test("converts private parameter properties", async () => {
  await testFn("private-params");
});

Deno.test("converts readonly parameter properties", async () => {
  await testFn("readonly-params");
});

Deno.test("converts mixed access modifiers", async () => {
  await testFn("mixed-modifiers");
});

Deno.test("handles parameter properties with initializers", async () => {
  await testFn("initializers");
});

Deno.test("handles complex types in parameter properties", async () => {
  await testFn("complex-types");
});

Deno.test("handles multiple classes in single file", async () => {
  await testFn("multiple-classes");
});

Deno.test("preserves existing class properties", async () => {
  await testFn("existing-properties");
});

Deno.test("handles classes without parameter properties", async () => {
  await testFn("no-params");
});

Deno.test("preserves comments", async () => {
  await testFn("comments");
});

Deno.test("handles generic classes", async () => {
  await testFn("generic-classes");
});

Deno.test("handles abstract classes", async () => {
  await testFn("abstract-classes");
});
