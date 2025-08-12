import { executeTest } from "../utils/test.ts";
import { parameterPropertiesCodemod } from "./parameter-properties.ts";

const testFn = await executeTest(parameterPropertiesCodemod);

Deno.test("converts public parameter properties", async () => {
  await testFn({
    testFile: "public_params_test.ts",
    inFile: "src/parameter-properties/spec/public-params.in.ts",
    outFile: "src/parameter-properties/spec/public-params.out.ts",
  });
});

Deno.test("converts private parameter properties", async () => {
  await testFn({
    testFile: "private_params_test.ts",
    inFile: "src/parameter-properties/spec/private-params.in.ts",
    outFile: "src/parameter-properties/spec/private-params.out.ts",
  });
});

Deno.test("converts readonly parameter properties", async () => {
  await testFn({
    testFile: "readonly_params_test.ts",
    inFile: "src/parameter-properties/spec/readonly-params.in.ts",
    outFile: "src/parameter-properties/spec/readonly-params.out.ts",
  });
});

Deno.test("converts mixed access modifiers", async () => {
  await testFn({
    testFile: "mixed_modifiers_test.ts",
    inFile: "src/parameter-properties/spec/mixed-modifiers.in.ts",
    outFile: "src/parameter-properties/spec/mixed-modifiers.out.ts",
  });
});

Deno.test("handles parameter properties with initializers", async () => {
  await testFn({
    testFile: "initializers_test.ts",
    inFile: "src/parameter-properties/spec/initializers.in.ts",
    outFile: "src/parameter-properties/spec/initializers.out.ts",
  });
});

Deno.test("handles complex types in parameter properties", async () => {
  await testFn({
    testFile: "complex_types_test.ts",
    inFile: "src/parameter-properties/spec/complex-types.in.ts",
    outFile: "src/parameter-properties/spec/complex-types.out.ts",
  });
});

Deno.test("handles multiple classes in single file", async () => {
  await testFn({
    testFile: "multiple_classes_test.ts",
    inFile: "src/parameter-properties/spec/multiple-classes.in.ts",
    outFile: "src/parameter-properties/spec/multiple-classes.out.ts",
  });
});

Deno.test("preserves existing class properties", async () => {
  await testFn({
    testFile: "existing_properties_test.ts",
    inFile: "src/parameter-properties/spec/existing-properties.in.ts",
    outFile: "src/parameter-properties/spec/existing-properties.out.ts",
  });
});

Deno.test("handles classes without parameter properties", async () => {
  await testFn({
    testFile: "no_params_test.ts",
    inFile: "src/parameter-properties/spec/no-params.in.ts",
    outFile: "src/parameter-properties/spec/no-params.out.ts",
  });
});

Deno.test("preserves comments", async () => {
  await testFn({
    testFile: "comments_test.ts",
    inFile: "src/parameter-properties/spec/comments.in.ts",
    outFile: "src/parameter-properties/spec/comments.out.ts",
  });
});

Deno.test("handles generic classes", async () => {
  await testFn({
    testFile: "generic_classes_test.ts",
    inFile: "src/parameter-properties/spec/generic-classes.in.ts",
    outFile: "src/parameter-properties/spec/generic-classes.out.ts",
  });
});

Deno.test("handles abstract classes", async () => {
  await testFn({
    testFile: "abstract_classes_test.ts",
    inFile: "src/parameter-properties/spec/abstract-classes.in.ts",
    outFile: "src/parameter-properties/spec/abstract-classes.out.ts",
  });
});
