import { assertEquals } from "@std/assert/equals";
import { spawn } from "node:child_process";

/**
 * Checks a TypeScript file using tsc.
 * @example
 * await checkTsFile("src/index.ts");
 */
async function checkTsFile(
  filePath: string,
  options: string[] = [],
): Promise<void> {
  await new Promise((resolve, reject) => {
    const tsc = spawn("deno", ["check", ...options, filePath]);

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

  constructor(
    codemod: (filePath: string) => void,
  ) {
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

export const executeTest = (config: {
  testDir: `${string}/`;
  codemod: (filePath: string) => void;
  checkTsOptions?: string[];
}) => {
  const { testDir, codemod, checkTsOptions } = config;
  const utils = new TestUtils(codemod);

  return async (
    testSlug: string,
  ) => {
    const testFile = testDir + testSlug + ".in.ts";
    const outFile = testDir + testSlug + ".out.ts";
    const tmpFile = testDir + testSlug + ".modded.ts";
    try {
      const originalContent = await Deno.readTextFile(
        testFile,
      );
      const expectedOutput = await Deno.readTextFile(
        outFile,
      );

      await utils.createTestFile(tmpFile, originalContent);
      const result = await utils.runAndReadCodemod(tmpFile);
      await checkTsFile(tmpFile, checkTsOptions);
      assertEquals(result, expectedOutput);
    } finally {
      await utils.cleanup();
    }
  };
};

export const executeProjectTest = (config: {
  testDir: `${string}/`;
  codemod: (globPath: string) => void;
  checkTsOptions?: string[];
}) => {
  const { testDir, codemod, checkTsOptions } = config;

  return async (
    projectSlug: string,
  ) => {
    const projectDir = testDir + projectSlug + "/";
    const tmpDir = testDir + projectSlug + ".modded/";
    
    try {
      // Find all .in.ts files in the project directory
      const entries = [];
      for await (const entry of Deno.readDir(projectDir)) {
        if (entry.isFile && entry.name.endsWith(".in.ts")) {
          entries.push(entry.name);
        }
      }

      // Create temp directory and copy files
      await Deno.mkdir(tmpDir, { recursive: true });
      
      for (const fileName of entries) {
        const originalContent = await Deno.readTextFile(projectDir + fileName);
        const tmpFileName = fileName.replace(".in.ts", ".ts");
        const tmpFilePath = tmpDir + tmpFileName;
        
        await Deno.writeTextFile(tmpFilePath, originalContent);
      }

      // Run codemod on the temp directory (pass glob pattern)
      codemod(tmpDir + "*.ts");

      // Format all files
      for (const fileName of entries) {
        const tmpFileName = fileName.replace(".in.ts", ".ts");
        const tmpFilePath = tmpDir + tmpFileName;
        await denoFmt(tmpFilePath);
      }

      // Verify against expected outputs
      for (const fileName of entries) {
        const outFileName = fileName.replace(".in.ts", ".out.ts");
        const tmpFileName = fileName.replace(".in.ts", ".ts");
        
        const expectedOutput = await Deno.readTextFile(projectDir + outFileName);
        const actualOutput = await Deno.readTextFile(tmpDir + tmpFileName);
        
        await checkTsFile(tmpDir + tmpFileName, checkTsOptions);
        assertEquals(actualOutput, expectedOutput, `File ${fileName} transformation mismatch`);
      }
      
    } finally {
      // Clean up temp directory
      if (!Deno.env.get("DEBUG")) {
        try {
          await Deno.remove(tmpDir, { recursive: true });
        } catch {
          // Ignore cleanup errors
        }
      }
    }
  };
};
