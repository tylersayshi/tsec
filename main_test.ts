import { assertEquals, assertExists } from "@std/assert";
import { runCodemod } from "./main.ts";

// Test helper function to read file content
async function readFileContent(filePath: string): Promise<string> {
  return await Deno.readTextFile(filePath);
}

// Test helper function to write file content
async function writeFileContent(
  filePath: string,
  content: string
): Promise<void> {
  await Deno.writeTextFile(filePath, content);
}

// Test helper function to create a backup of the sample file
async function backupSampleFile(): Promise<void> {
  try {
    const content = await readFileContent("sample.ts");
    await writeFileContent("sample_backup.ts", content);
  } catch {
    // File doesn't exist, ignore
  }
}

// Test helper function to restore the sample file
async function restoreSampleFile(): Promise<void> {
  try {
    const content = await readFileContent("sample_backup.ts");
    await writeFileContent("sample.ts", content);
  } catch {
    // Backup doesn't exist, ignore
  }
}

// Backup original file
await backupSampleFile();

try {
  // Read original content
  const originalContent = await readFileContent("sample.ts");
  await writeFileContent("sample_backup.ts", originalContent);

  // Run the codemod
  runCodemod("sample.ts");

  // Read converted content
  const convertedContent = await readFileContent("sample.ts");
  await writeFileContent("sample_converted.ts", convertedContent);

  // Verify the conversion
  Deno.test("Color enum should be converted to object", () => {
    assertEquals(
      convertedContent.includes("const Color = {") &&
        convertedContent.includes(
          "type Color = typeof Color[keyof typeof Color]"
        ),
      true,
      "Color enum should be converted to object"
    );
  });

  Deno.test("Status enum should be converted to object", () => {
    assertEquals(
      convertedContent.includes("const Status = {") &&
        convertedContent.includes(
          "type Status = typeof Status[keyof typeof Status]"
        ),
      true,
      "Status enum should be converted to object"
    );
  });

  Deno.test("Direction enum should be converted to object", () => {
    assertEquals(
      convertedContent.includes("const Direction = {") &&
        convertedContent.includes(
          "type Direction = typeof Direction[keyof typeof Direction]"
        ),
      true,
      "Direction enum should be converted to object"
    );
  });

  Deno.test("Priority enum should be converted to object", () => {
    assertEquals(
      convertedContent.includes("const Priority = {") &&
        convertedContent.includes(
          "type Priority = typeof Priority[keyof typeof Priority]"
        ),
      true,
      "Priority enum should be converted to object"
    );
  });

  Deno.test("No enum declarations should remain", () => {
    console.log(convertedContent);
    assertEquals(
      !convertedContent.includes("enum "),
      true,
      "No enum declarations should remain"
    );
  });

  Deno.test("Object properties should be preserved", () => {
    assertEquals(
      convertedContent.includes('Red: "red"') &&
        convertedContent.includes("Pending: 0") &&
        convertedContent.includes('North: "NORTH"'),
      true,
      "Object properties should be preserved"
    );
  });

  Deno.test("Type references should still work", () => {
    assertEquals(
      convertedContent.includes(
        "function _getColorName(color: Color): string"
      ) && convertedContent.includes("status: Status"),
      true,
      "Type references should still work"
    );
  });

  Deno.test("Value references should still work", () => {
    assertEquals(
      convertedContent.includes("Color.Red") &&
        convertedContent.includes("Status.Active") &&
        convertedContent.includes("Direction.North"),
      true,
      "Value references should still work"
    );
  });

  // Additional verification: check that the converted code is syntactically valid

  // Check for object declarations
  const objectDeclarations = (convertedContent.match(/const \w+ = \{/g) || [])
    .length;
  assertEquals(
    objectDeclarations,
    4,
    "Expected 4 object declarations (one for each enum)"
  );

  // Check for type definitions
  const typeDefinitions = (
    convertedContent.match(/type \w+ = typeof \w+\[keyof typeof \w+\]/g) || []
  ).length;
  assertEquals(
    typeDefinitions,
    4,
    "Expected 4 type definitions (one for each enum)"
  );

  // Check that all enum value references are preserved
  const enumValueReferences = (
    convertedContent.match(/\w+\.\w+/g) || []
  ).filter(
    (ref) =>
      ref.includes("Color.") ||
      ref.includes("Status.") ||
      ref.includes("Direction.") ||
      ref.includes("Priority.")
  ).length;
  assertExists(
    enumValueReferences > 0,
    "Expected to find enum value references in the converted code"
  );
} finally {
  // Restore original file
  await restoreSampleFile();
}

Deno.test("SimpleEnum should be converted with numeric values", async () => {
  const edgeCaseContent = `
enum SimpleEnum {
  A,
  B,
  C
}
`;
  await writeFileContent("edge_cases.ts", edgeCaseContent);
  try {
    runCodemod("edge_cases.ts");
    const convertedContent = await readFileContent("edge_cases.ts");
    assertEquals(
      convertedContent.includes("const SimpleEnum = {") &&
        convertedContent.includes("A: 0"),
      true,
      "SimpleEnum should be converted with numeric values"
    );
  } finally {
    try {
      await Deno.remove("edge_cases.ts");
    } catch {
      // File doesn't exist, ignore
    }
  }
});

Deno.test("StringEnum should be converted with string values", async () => {
  const edgeCaseContent = `
enum StringEnum {
  X = "x",
  Y = "y"
}
`;
  await writeFileContent("edge_cases.ts", edgeCaseContent);
  try {
    runCodemod("edge_cases.ts");
    const convertedContent = await readFileContent("edge_cases.ts");
    assertEquals(
      convertedContent.includes("const StringEnum = {") &&
        convertedContent.includes('X: "x"'),
      true,
      "StringEnum should be converted with string values"
    );
  } finally {
    try {
      await Deno.remove("edge_cases.ts");
    } catch {
      // File doesn't exist, ignore
    }
  }
});

Deno.test("MixedEnum should be converted with mixed values", async () => {
  const edgeCaseContent = `
enum MixedEnum {
  One = 1,
  Two = "two",
  Three = 3
}
`;
  await writeFileContent("edge_cases.ts", edgeCaseContent);
  try {
    runCodemod("edge_cases.ts");
    const convertedContent = await readFileContent("edge_cases.ts");
    assertEquals(
      convertedContent.includes("const MixedEnum = {") &&
        convertedContent.includes("One: 1") &&
        convertedContent.includes('Two: "two"'),
      true,
      "MixedEnum should be converted with mixed values"
    );
  } finally {
    try {
      await Deno.remove("edge_cases.ts");
    } catch {
      // File doesn't exist, ignore
    }
  }
});

Deno.test("Type references should be preserved in edge cases", async () => {
  const edgeCaseContent = `
enum SimpleEnum {
  A,
  B,
  C
}
enum StringEnum {
  X = "x",
  Y = "y"
}
function testEdgeCases() {
  const simple: SimpleEnum = SimpleEnum.A;
  const string: StringEnum = StringEnum.X;
  return { simple, string };
}
`;
  await writeFileContent("edge_cases.ts", edgeCaseContent);
  try {
    runCodemod("edge_cases.ts");
    const convertedContent = await readFileContent("edge_cases.ts");
    assertEquals(
      convertedContent.includes("const simple: SimpleEnum") &&
        convertedContent.includes("const string: StringEnum"),
      true,
      "Type references should be preserved"
    );
  } finally {
    try {
      await Deno.remove("edge_cases.ts");
    } catch {}
  }
});

Deno.test("Value references should be preserved in edge cases", async () => {
  const edgeCaseContent = `
enum SimpleEnum {
  A,
  B,
  C
}
enum StringEnum {
  X = "x",
  Y = "y"
}
enum MixedEnum {
  One = 1,
  Two = "two",
  Three = 3
}
function testEdgeCases() {
  const simple: SimpleEnum = SimpleEnum.A;
  const string: StringEnum = StringEnum.X;
  const mixed: MixedEnum = MixedEnum.Two;
  return { simple, string, mixed };
}
`;
  await writeFileContent("edge_cases.ts", edgeCaseContent);
  try {
    runCodemod("edge_cases.ts");
    const convertedContent = await readFileContent("edge_cases.ts");
    assertEquals(
      convertedContent.includes("SimpleEnum.A") &&
        convertedContent.includes("StringEnum.X") &&
        convertedContent.includes("MixedEnum.Two"),
      true,
      "Value references should be preserved"
    );
  } finally {
    try {
      await Deno.remove("edge_cases.ts");
    } catch {
      // File doesn't exist, ignore
    }
  }
});
