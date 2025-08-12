import { parameterPropertiesCodemod } from "./parameter-properties.ts";
import { spawn } from "node:child_process";
import { assertEquals } from "jsr:@std/assert";

/**
 * Checks a TypeScript file using tsc.
 * @example
 * await checkTsFile("src/index.ts");
 */
async function checkTsFile(filePath: string): Promise<void> {
  await new Promise((resolve, reject) => {
    const tsc = spawn("deno", ["check", filePath]);

    tsc.stderr.on("data", (data) => {
      console.error(data.toString());
    });

    tsc.on("close", (code: number) => {
      if (code === 0) {
        console.log("Typecheck succeeded 🎉");
        resolve(undefined);
      } else {
        reject(new Error("Typecheck failed"));
      }
    });
  });
}

async function denoFmt(filePath: string): Promise<void> {
  await new Promise((resolve, reject) => {
    const tsc = spawn("deno", ["fmt", filePath]);

    tsc.stderr.on("data", (data) => {
      console.error(data.toString());
    });

    tsc.on("close", (code: number) => {
      if (code === 0) {
        console.log("Typecheck succeeded 🎉");
        resolve(undefined);
      } else {
        reject(new Error("Typecheck failed"));
      }
    });
  });
}

/**
 * Test utilities for codemod testing with proper cleanup
 * @example
 * const utils = new TestUtils();
 * await utils.createTestFile("test.ts", "class Test { constructor(public name: string) {} }");
 */
class TestUtils {
  private tempFiles = new Set<string>();

  async createTestFile(filePath: string, content: string): Promise<void> {
    await Deno.writeTextFile(filePath, content);
    this.tempFiles.add(filePath);
  }

  async readTestFile(filePath: string): Promise<string> {
    return await Deno.readTextFile(filePath);
  }

  async runAndReadCodemod(filePath: string): Promise<string> {
    parameterPropertiesCodemod(filePath);
    await denoFmt(filePath);
    return await this.readTestFile(filePath);
  }

  async cleanup(): Promise<void> {
    if (Deno.env.get("DEBUG")) return;
    for (const file of this.tempFiles) {
      try {
        await Deno.remove(file);
      } catch {
        // Ignore if file doesn't exist
      }
    }
    this.tempFiles.clear();
  }
}

Deno.test("converts public parameter properties", async () => {
  const utils = new TestUtils();
  const testFile = "tmp/public_params_test.ts";

  try {
    const originalContent = await Deno.readTextFile(
      "src/parameter-properties/spec/public-params.in.ts",
    );
    const expectedOutput = await Deno.readTextFile(
      "src/parameter-properties/spec/public-params.out.ts",
    );

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runAndReadCodemod(testFile);
    await checkTsFile(testFile);
    assertEquals(result, expectedOutput);
  } finally {
    await utils.cleanup();
  }
});

Deno.test("converts private parameter properties", async () => {
  const utils = new TestUtils();
  const testFile = "tmp/private_params_test.ts";

  try {
    const originalContent = await Deno.readTextFile(
      "src/parameter-properties/spec/private-params.in.ts",
    );
    const expectedOutput = await Deno.readTextFile(
      "src/parameter-properties/spec/private-params.out.ts",
    );

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runAndReadCodemod(testFile);
    await checkTsFile(testFile);
    assertEquals(result, expectedOutput);
  } finally {
    await utils.cleanup();
  }
});

Deno.test("converts readonly parameter properties", async () => {
  const utils = new TestUtils();
  const testFile = "tmp/readonly_params_test.ts";

  try {
    const originalContent = await Deno.readTextFile(
      "src/parameter-properties/spec/readonly-params.in.ts",
    );
    const expectedOutput = await Deno.readTextFile(
      "src/parameter-properties/spec/readonly-params.out.ts",
    );

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runAndReadCodemod(testFile);
    await checkTsFile(testFile);
    assertEquals(result, expectedOutput);
  } finally {
    await utils.cleanup();
  }
});

Deno.test("converts mixed access modifiers", async () => {
  const utils = new TestUtils();
  const testFile = "tmp/mixed_modifiers_test.ts";

  try {
    const originalContent = await Deno.readTextFile(
      "src/parameter-properties/spec/mixed-modifiers.in.ts",
    );
    const expectedOutput = await Deno.readTextFile(
      "src/parameter-properties/spec/mixed-modifiers.out.ts",
    );

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runAndReadCodemod(testFile);
    await checkTsFile(testFile);
    assertEquals(result, expectedOutput);
  } finally {
    await utils.cleanup();
  }
});

Deno.test("handles parameter properties with initializers", async () => {
  const utils = new TestUtils();
  const testFile = "tmp/initializers_test.ts";

  try {
    const originalContent = await Deno.readTextFile(
      "src/parameter-properties/spec/initializers.in.ts",
    );
    const expectedOutput = await Deno.readTextFile(
      "src/parameter-properties/spec/initializers.out.ts",
    );

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runAndReadCodemod(testFile);
    await checkTsFile(testFile);
    assertEquals(result, expectedOutput);
  } finally {
    await utils.cleanup();
  }
});

Deno.test("handles complex types in parameter properties", async () => {
  const utils = new TestUtils();
  const testFile = "tmp/complex_types_test.ts";

  try {
    const originalContent = await Deno.readTextFile(
      "src/parameter-properties/spec/complex-types.in.ts",
    );
    const expectedOutput = await Deno.readTextFile(
      "src/parameter-properties/spec/complex-types.out.ts",
    );

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runAndReadCodemod(testFile);
    await checkTsFile(testFile);
    assertEquals(result, expectedOutput);
  } finally {
    await utils.cleanup();
  }
});

Deno.test("handles multiple classes in single file", async () => {
  const utils = new TestUtils();
  const testFile = "tmp/multiple_classes_test.ts";

  try {
    const originalContent = await Deno.readTextFile(
      "src/parameter-properties/spec/multiple-classes.in.ts",
    );
    const expectedOutput = await Deno.readTextFile(
      "src/parameter-properties/spec/multiple-classes.out.ts",
    );

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runAndReadCodemod(testFile);
    await checkTsFile(testFile);
    assertEquals(result, expectedOutput);
  } finally {
    await utils.cleanup();
  }
});

Deno.test("preserves existing class properties", async () => {
  const utils = new TestUtils();
  const testFile = "tmp/existing_properties_test.ts";

  try {
    const originalContent = await Deno.readTextFile(
      "src/parameter-properties/spec/existing-properties.in.ts",
    );
    const expectedOutput = await Deno.readTextFile(
      "src/parameter-properties/spec/existing-properties.out.ts",
    );

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runAndReadCodemod(testFile);
    await checkTsFile(testFile);
    assertEquals(result, expectedOutput);
  } finally {
    await utils.cleanup();
  }
});

Deno.test("handles classes without parameter properties", async () => {
  const utils = new TestUtils();
  const testFile = "tmp/no_params_test.ts";

  try {
    const originalContent = await Deno.readTextFile(
      "src/parameter-properties/spec/no-params.in.ts",
    );
    const expectedOutput = await Deno.readTextFile(
      "src/parameter-properties/spec/no-params.out.ts",
    );

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runAndReadCodemod(testFile);
    await checkTsFile(testFile);
    assertEquals(result, expectedOutput);
  } finally {
    await utils.cleanup();
  }
});

Deno.test("preserves comments", async () => {
  const utils = new TestUtils();
  const testFile = "tmp/comments_test.ts";

  try {
    const originalContent = await Deno.readTextFile(
      "src/parameter-properties/spec/comments.in.ts",
    );
    const expectedOutput = await Deno.readTextFile(
      "src/parameter-properties/spec/comments.out.ts",
    );

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runAndReadCodemod(testFile);
    await checkTsFile(testFile);
    assertEquals(result, expectedOutput);
  } finally {
    await utils.cleanup();
  }
});

Deno.test("handles generic classes", async () => {
  const utils = new TestUtils();
  const testFile = "tmp/generic_classes_test.ts";

  try {
    const originalContent = await Deno.readTextFile(
      "src/parameter-properties/spec/generic-classes.in.ts",
    );
    const expectedOutput = await Deno.readTextFile(
      "src/parameter-properties/spec/generic-classes.out.ts",
    );

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runAndReadCodemod(testFile);
    await checkTsFile(testFile);
    assertEquals(result, expectedOutput);
  } finally {
    await utils.cleanup();
  }
});

Deno.test("handles abstract classes", async () => {
  const utils = new TestUtils();
  const testFile = "tmp/abstract_classes_test.ts";

  try {
    const originalContent = await Deno.readTextFile(
      "src/parameter-properties/spec/abstract-classes.in.ts",
    );
    const expectedOutput = await Deno.readTextFile(
      "src/parameter-properties/spec/abstract-classes.out.ts",
    );

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runAndReadCodemod(testFile);
    await checkTsFile(testFile);
    assertEquals(result, expectedOutput);
  } finally {
    await utils.cleanup();
  }
});
