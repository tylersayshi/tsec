import { assertEquals } from "@std/assert/equals";
import { fileExtensionCodemod } from "./file-extension.ts";

// Custom test function that skips typechecking
async function testFileExtension(testSlug: string) {
  const testDir = "src/file-extension/spec/";
  const testFile = testDir + testSlug + ".in.ts";
  const outFile = testDir + testSlug + ".out.ts";
  const tmpFile = testDir + testSlug + ".modded.ts";

  try {
    const originalContent = await Deno.readTextFile(testFile);
    const expectedOutput = await Deno.readTextFile(outFile);

    // Create temporary file
    await Deno.writeTextFile(tmpFile, originalContent);

    // Run codemod
    fileExtensionCodemod(tmpFile);

    // Read result
    const result = await Deno.readTextFile(tmpFile);

    // Compare with expected output
    assertEquals(result, expectedOutput);
  } finally {
    // Cleanup
    try {
      await Deno.remove(tmpFile);
    } catch {
      // Ignore if file doesn't exist
    }
  }
}

Deno.test("converts .js extensions to .ts", async () => {
  await testFileExtension("js-to-ts");
});

Deno.test("adds .ts extension to files with no extension", async () => {
  await testFileExtension("no-extension");
});

Deno.test("handles mixed import types", async () => {
  await testFileExtension("mixed-imports");
});

Deno.test("preserves external package imports unchanged", async () => {
  await testFileExtension("external-packages");
});

Deno.test("handles nested directory imports", async () => {
  await testFileExtension("nested-directories");
});

Deno.test("preserves .ts extensions unchanged", async () => {
  await testFileExtension("ts-extensions");
});

Deno.test("handles index file imports", async () => {
  await testFileExtension("index-files");
});

Deno.test("comprehensive file extension transformation", async () => {
  await testFileExtension("comprehensive");
});

Deno.test("handles type-only imports", async () => {
  await testFileExtension("type-imports");
});

Deno.test("handles dynamic imports", async () => {
  await testFileExtension("dynamic-imports");
});

Deno.test("preserves comments and formatting", async () => {
  await testFileExtension("comments");
});

Deno.test("handles multiple imports in single file", async () => {
  await testFileExtension("multiple-imports");
});

Deno.test("handles complex relative paths", async () => {
  await testFileExtension("complex-paths");
});
