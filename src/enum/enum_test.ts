import { runCodemod } from "./enum.ts";
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

/**
 * Test utilities for codemod testing with proper cleanup
 * @example
 * const utils = new TestUtils();
 * await utils.createTestFile("test.ts", "enum Color { Red }");
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
    runCodemod(filePath);
    return await this.readTestFile(filePath);
  }

  async cleanup(): Promise<void> {
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

Deno.test("converts string enum to object", async () => {
  const utils = new TestUtils();
  const testFile = "string_enum_test.ts";

  try {
    const originalContent = `enum Color {
  Red = "red",
  Blue = "blue",
  Green = "green"
}

function getColorName(color: Color): string {
  return color === Color.Red ? "Red color" : "Other color";
}

const userColor: Color = Color.Blue;`;

    const expectedOutput = `const Color = {
  Red: "red",
  Blue: "blue",
  Green: "green",
} as const;
type ColorType = typeof Color[keyof typeof Color];

function getColorName(color: ColorType): string {
  return color === Color.Red ? "Red color" : "Other color";
}

const userColor: ColorType = Color.Blue;`;

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runAndReadCodemod(testFile);
    await checkTsFile(testFile);
    assertEquals(result, expectedOutput);
  } finally {
    await utils.cleanup();
  }
});

Deno.test("converts numeric enum to object", async () => {
  const utils = new TestUtils();
  const testFile = "numeric_enum_test.ts";

  try {
    const originalContent = `enum Status {
  Pending = 0,
  Active = 1,
  Inactive = 2
}

interface User {
  name: string;
  status: Status;
}

function createUser(name: string): User {
  return {
    name,
    status: Status.Pending
  };
}`;

    const expectedOutput = `const Status = {
  Pending: 0,
  Active: 1,
  Inactive: 2,
} as const;
type StatusType = typeof Status[keyof typeof Status];

interface User {
  name: string;
  status: StatusType;
}

function createUser(name: string): User {
  return {
    name,
    status: Status.Pending
  };
}`;

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runAndReadCodemod(testFile);
    await checkTsFile(testFile);
    assertEquals(result, expectedOutput);
  } finally {
    await utils.cleanup();
  }
});

Deno.test("converts auto-incrementing enum to object", async () => {
  const utils = new TestUtils();
  const testFile = "auto_enum_test.ts";

  try {
    const originalContent = `enum Direction {
  North,
  South,
  East,
  West
}

const compass: Direction[] = [
  Direction.North,
  Direction.South,
  Direction.East,
  Direction.West
];`;

    const expectedOutput = `const Direction = {
  North: "North",
  South: "South",
  East: "East",
  West: "West",
} as const;
type DirectionType = typeof Direction[keyof typeof Direction];

const compass: DirectionType[] = [
  Direction.North,
  Direction.South,
  Direction.East,
  Direction.West
];`;

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runAndReadCodemod(testFile);
    await checkTsFile(testFile);
    assertEquals(result, expectedOutput);
  } finally {
    await utils.cleanup();
  }
});

Deno.test("converts mixed value enum to object", async () => {
  const utils = new TestUtils();
  const testFile = "mixed_enum_test.ts";

  try {
    const originalContent = `enum MixedEnum {
  First = 1,
  Second = "second",
  Third = 3,
  Fourth = "fourth"
}

function handleMixed(value: MixedEnum): string {
  switch (value) {
    case MixedEnum.First:
      return "Number one";
    case MixedEnum.Second:
      return "String second";
    case MixedEnum.Third:
      return "Number three";
    case MixedEnum.Fourth:
      return "String fourth";
    default:
      return "Unknown";
  }
}`;

    const expectedOutput = `const MixedEnum = {
  First: 1,
  Second: "second",
  Third: 3,
  Fourth: "fourth",
} as const;
type MixedEnumType = typeof MixedEnum[keyof typeof MixedEnum];

function handleMixed(value: MixedEnumType): string {
  switch (value) {
    case MixedEnum.First:
      return "Number one";
    case MixedEnum.Second:
      return "String second";
    case MixedEnum.Third:
      return "Number three";
    case MixedEnum.Fourth:
      return "String fourth";
    default:
      return "Unknown";
  }
}`;

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runAndReadCodemod(testFile);
    await checkTsFile(testFile);
    assertEquals(result, expectedOutput);
  } finally {
    await utils.cleanup();
  }
});

Deno.test("converts multiple enums in single file", async () => {
  const utils = new TestUtils();
  const testFile = "multiple_enums_test.ts";

  try {
    const originalContent = `enum Color {
  Red = "red",
  Blue = "blue"
}

enum Status {
  Active = 1,
  Inactive = 0
}

enum Priority {
  Low,
  Medium,
  High
}

interface Task {
  color: Color;
  status: Status;
  priority: Priority;
}

function createTask(): Task {
  return {
    color: Color.Red,
    status: Status.Active,
    priority: Priority.High
  };
}

class TaskManager {
  private tasks: Task[] = [];
  
  addTask(color: Color = Color.Blue): void {
    this.tasks.push({
      color,
      status: Status.Inactive,
      priority: Priority.Medium
    });
  }
}`;

    const expectedOutput = `const Color = {
  Red: "red",
  Blue: "blue",
} as const;
type ColorType = typeof Color[keyof typeof Color];

const Status = {
  Active: 1,
  Inactive: 0,
} as const;
type StatusType = typeof Status[keyof typeof Status];

const Priority = {
  Low: "Low",
  Medium: "Medium",
  High: "High",
} as const;
type PriorityType = typeof Priority[keyof typeof Priority];

interface Task {
  color: ColorType;
  status: StatusType;
  priority: PriorityType;
}

function createTask(): Task {
  return {
    color: Color.Red,
    status: Status.Active,
    priority: Priority.High
  };
}

class TaskManager {
  private tasks: Task[] = [];
  
  addTask(color: ColorType = Color.Blue): void {
    this.tasks.push({
      color,
      status: Status.Inactive,
      priority: Priority.Medium
    });
  }
}`;

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runAndReadCodemod(testFile);
    await checkTsFile(testFile);
    assertEquals(result, expectedOutput);
  } finally {
    await utils.cleanup();
  }
});

Deno.test("preserves enum usage in complex scenarios", async () => {
  const utils = new TestUtils();
  const testFile = "complex_usage_test.ts";

  try {
    const originalContent = `enum ApiEndpoint {
  Users = "/api/users",
  Posts = "/api/posts",
  Comments = "/api/comments"
}

enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}

enum ResponseStatus {
  Success = 200,
  NotFound = 404,
  ServerError = 500
}

interface ApiRequest {
  endpoint: ApiEndpoint;
  method: HttpMethod;
}

interface ApiResponse<T = unknown> {
  status: ResponseStatus;
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async makeRequest<T>(
    endpoint: ApiEndpoint,
    method: HttpMethod = HttpMethod.GET
  ): Promise<ApiResponse<T>> {
    const url = \`\${this.baseUrl}\${endpoint}\`;
    
    try {
      const response = await fetch(url, { method });
      
      if (response.ok) {
        const data = await response.json();
        return {
          status: ResponseStatus.Success,
          data
        };
      } else {
        return {
          status: response.status === 404 ? ResponseStatus.NotFound : ResponseStatus.ServerError,
          error: \`Request failed with status \${response.status}\`
        };
      }
    } catch (error: any) {
      return {
        status: ResponseStatus.ServerError,
        error: error.message
      };
    }
  }
}

// Usage examples
const client = new ApiClient("https://api.example.com");
const usersRequest: ApiRequest = {
  endpoint: ApiEndpoint.Users,
  method: HttpMethod.GET
};`;

    const expectedOutput = `const ApiEndpoint = {
  Users: "/api/users",
  Posts: "/api/posts",
  Comments: "/api/comments",
} as const;
type ApiEndpointType = typeof ApiEndpoint[keyof typeof ApiEndpoint];

const HttpMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;
type HttpMethodType = typeof HttpMethod[keyof typeof HttpMethod];

const ResponseStatus = {
  Success: 200,
  NotFound: 404,
  ServerError: 500,
} as const;
type ResponseStatusType = typeof ResponseStatus[keyof typeof ResponseStatus];

interface ApiRequest {
  endpoint: ApiEndpointType;
  method: HttpMethodType;
}

interface ApiResponse<T = unknown> {
  status: ResponseStatusType;
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async makeRequest<T>(
    endpoint: ApiEndpointType,
    method: HttpMethodType = HttpMethod.GET
  ): Promise<ApiResponse<T>> {
    const url = \`\${this.baseUrl}\${endpoint}\`;
    
    try {
      const response = await fetch(url, { method });
      
      if (response.ok) {
        const data = await response.json();
        return {
          status: ResponseStatus.Success,
          data
        };
      } else {
        return {
          status: response.status === 404 ? ResponseStatus.NotFound : ResponseStatus.ServerError,
          error: \`Request failed with status \${response.status}\`
        };
      }
    } catch (error: any) {
      return {
        status: ResponseStatus.ServerError,
        error: error.message
      };
    }
  }
}

// Usage examples
const client = new ApiClient("https://api.example.com");
const usersRequest: ApiRequest = {
  endpoint: ApiEndpoint.Users,
  method: HttpMethod.GET
};`;

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runAndReadCodemod(testFile);
    await checkTsFile(testFile);
    assertEquals(result, expectedOutput);
  } finally {
    await utils.cleanup();
  }
});

Deno.test("handles const enum conversion", async () => {
  const utils = new TestUtils();
  const testFile = "const_enum_test.ts";

  try {
    const originalContent = `const enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3
}

function log(level: LogLevel, message: string): void {
  if (level >= LogLevel.Info) {
    console.log(\`[\${level}] \${message}\`);
  }
}

log(LogLevel.Error, "Something went wrong");`;

    const expectedOutput = `const LogLevel = {
  Debug: 0,
  Info: 1,
  Warn: 2,
  Error: 3,
} as const;
type LogLevelType = typeof LogLevel[keyof typeof LogLevel];

function log(level: LogLevelType, message: string): void {
  if (level >= LogLevel.Info) {
    console.log(\`[\${level}] \${message}\`);
  }
}

log(LogLevel.Error, "Something went wrong");`;

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
  const testFile = "comments_test.ts";

  try {
    const originalContent = await Deno.readTextFile(
      "src/enum/spec/comments.in.ts",
    );
    const expectedOutput = await Deno.readTextFile(
      "src/enum/spec/comments.out.ts",
    );

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runAndReadCodemod(testFile);
    await checkTsFile(testFile);
    assertEquals(result, expectedOutput);
  } finally {
    await utils.cleanup();
  }
});

Deno.test("comprehensive enum transformation - full sample", async () => {
  const utils = new TestUtils();
  const testFile = "comprehensive_sample.ts";

  try {
    const sampleContent = await Deno.readTextFile(
      "src/enum/spec/comprehensive.in.ts",
    );

    await utils.createTestFile(testFile, sampleContent);
    const result = await utils.runAndReadCodemod(testFile);
    await checkTsFile(testFile);
    await Deno.writeTextFile("tmp/out.ts", result);
    assertEquals(
      result,
      await Deno.readTextFile("src/enum/spec/comprehensive.out.ts"),
    );
  } finally {
    await utils.cleanup();
  }
});

Deno.test(
  "enum usage in destructuring and object patterns",
  async () => {
    const utils = new TestUtils();
    const testFile = "destructuring_test.ts";

    try {
      const originalContent = await Deno.readTextFile(
        "src/enum/spec/object-patterns.in.ts",
      );
      const expectedOutput = await Deno.readTextFile(
        "src/enum/spec/object-patterns.out.ts",
      );

      await utils.createTestFile(testFile, originalContent);
      const result = await utils.runAndReadCodemod(testFile);
      await checkTsFile(testFile);
      assertEquals(result, expectedOutput);
    } finally {
      await utils.cleanup();
    }
  },
);

Deno.test(
  "enum usage in template literals and conditionals",
  async () => {
    const utils = new TestUtils();
    const testFile = "templates_conditionals_test.ts";

    try {
      const originalContent = await Deno.readTextFile(
        "src/enum/spec/template-literal.in.ts",
      );
      const expectedOutput = await Deno.readTextFile(
        "src/enum/spec/template-literal.out.ts",
      );

      await utils.createTestFile(testFile, originalContent);
      const result = await utils.runAndReadCodemod(testFile);
      await checkTsFile(testFile);
      assertEquals(result, expectedOutput);
    } finally {
      await utils.cleanup();
    }
  },
);

Deno.test(
  "enum usage with arrays, maps and complex data structures",
  async () => {
    const utils = new TestUtils();
    const testFile = "data_structures_test.ts";

    try {
      const originalContent = await Deno.readTextFile(
        "src/enum/spec/data-structures.in.ts",
      );

      const expectedOutput = await Deno.readTextFile(
        "src/enum/spec/data-structures.out.ts",
      );

      await utils.createTestFile(testFile, originalContent);
      const result = await utils.runAndReadCodemod(testFile);
      await checkTsFile(testFile);
      assertEquals(result, expectedOutput);
    } finally {
      await utils.cleanup();
    }
  },
);
