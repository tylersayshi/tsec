import { assertEquals } from "@std/assert/equals";
import { spawn } from "node:child_process";

/**
 * Checks a TypeScript file using tsc.
 * @example
 * await checkTsFile("src/index.ts");
 */
async function checkTsFile(filePath: string): Promise<void> {
  await new Promise((resolve, reject) => {
    const tsc = spawn("deno", ["check", filePath]);

    // deno-lint-ignore no-explicit-any
    tsc.stderr.on("data", (data: any) => {
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

    // deno-lint-ignore no-explicit-any
    tsc.stderr.on("data", (data: any) => {
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
  private codemod: (filePath: string) => void;

  constructor(codemod: (filePath: string) => void) {
    this.codemod = codemod;
  }

  async createTestFile(filePath: string, content: string): Promise<void> {
    await Deno.writeTextFile(filePath, content);
    this.tempFiles.add(filePath);
  }

  async runAndReadCodemod(filePath: string): Promise<string> {
    this.codemod(filePath);
    await denoFmt(filePath);
    return Deno.readTextFile(filePath);
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

export const executeTest = (codemod: (filePath: string) => void) => {
  const utils = new TestUtils(codemod);

  return async (
    config: {
      testFile: string;
      inFile: string;
      outFile: string;
    },
  ) => {
    const { testFile, inFile, outFile } = config;

    try {
      const originalContent = await Deno.readTextFile(
        inFile,
      );
      const expectedOutput = await Deno.readTextFile(
        outFile,
      );

      await utils.createTestFile(testFile, originalContent);
      const result = await utils.runAndReadCodemod(testFile);
      await checkTsFile(testFile);
      assertEquals(result, expectedOutput);
    } finally {
      await utils.cleanup();
    }
  };
};
