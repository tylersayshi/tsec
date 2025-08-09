import { assertSnapshot } from "jsr:@std/testing/snapshot";
import { runCodemod } from "./main.ts";

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

  async runCodemodAndSnapshot(filePath: string): Promise<string> {
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

Deno.test("converts string enum to object", async (t) => {
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

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runCodemodAndSnapshot(testFile);
    await assertSnapshot(t, result);
  } finally {
    await utils.cleanup();
  }
});

Deno.test("converts numeric enum to object", async (t) => {
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

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runCodemodAndSnapshot(testFile);
    await assertSnapshot(t, result);
  } finally {
    await utils.cleanup();
  }
});

Deno.test("converts auto-incrementing enum to object", async (t) => {
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

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runCodemodAndSnapshot(testFile);
    await assertSnapshot(t, result);
  } finally {
    await utils.cleanup();
  }
});

Deno.test("converts mixed value enum to object", async (t) => {
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

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runCodemodAndSnapshot(testFile);
    await assertSnapshot(t, result);
  } finally {
    await utils.cleanup();
  }
});

Deno.test("converts multiple enums in single file", async (t) => {
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
      status: Status.Pending,
      priority: Priority.Medium
    });
  }
}`;

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runCodemodAndSnapshot(testFile);
    await assertSnapshot(t, result);
  } finally {
    await utils.cleanup();
  }
});

Deno.test("preserves enum usage in complex scenarios", async (t) => {
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
    } catch (error) {
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
    const result = await utils.runCodemodAndSnapshot(testFile);
    await assertSnapshot(t, result);
  } finally {
    await utils.cleanup();
  }
});

Deno.test("handles const enum conversion", async (t) => {
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
    console.log(\`[\${LogLevel[level]}] \${message}\`);
  }
}

log(LogLevel.Error, "Something went wrong");`;

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runCodemodAndSnapshot(testFile);
    await assertSnapshot(t, result);
  } finally {
    await utils.cleanup();
  }
});

Deno.test("preserves comments and formatting context", async (t) => {
  const utils = new TestUtils();
  const testFile = "comments_test.ts";

  try {
    const originalContent = `/**
 * Represents different user roles in the system
 */
enum UserRole {
  /** Regular user with basic permissions */
  User = "user",
  /** Moderator with elevated permissions */
  Moderator = "moderator", 
  /** Administrator with full access */
  Admin = "admin"
}

// Default role for new users
const DEFAULT_ROLE: UserRole = UserRole.User;

/*
 * Permission check function
 */
function hasPermission(role: UserRole, action: string): boolean {
  switch (role) {
    case UserRole.Admin:
      return true; // Admin can do everything
    case UserRole.Moderator:
      return action !== "delete_user";
    case UserRole.User:
      return action === "read";
    default:
      return false;
  }
}`;

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runCodemodAndSnapshot(testFile);
    await assertSnapshot(t, result);
  } finally {
    await utils.cleanup();
  }
});

Deno.test("handles edge case with computed enum values", async (t) => {
  const utils = new TestUtils();
  const testFile = "computed_enum_test.ts";

  try {
    const originalContent = `enum FileSize {
  Small = 1024,
  Medium = Small * 10,
  Large = Medium * 10,
  XLarge = Large * 10
}

enum Flags {
  None = 0,
  Read = 1 << 0,
  Write = 1 << 1,
  Execute = 1 << 2,
  All = Read | Write | Execute
}

function checkFileSize(size: number): string {
  if (size <= FileSize.Small) return "small";
  if (size <= FileSize.Medium) return "medium";
  if (size <= FileSize.Large) return "large";
  return "xlarge";
}`;

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runCodemodAndSnapshot(testFile);
    await assertSnapshot(t, result);
  } finally {
    await utils.cleanup();
  }
});
