import { runCodemod } from "./main.ts";
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
  Green: "green"
} as const;
type ColorType = typeof Color[keyof typeof Color];

function getColorName(color: ColorType): string {
  return color === Color.Red ? "Red color" : "Other color";
}

const userColor: ColorType = Color.Blue;`;

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runCodemodAndSnapshot(testFile);
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
  Inactive: 2
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
    const result = await utils.runCodemodAndSnapshot(testFile);
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
  North: 0,
  South: 1,
  East: 2,
  West: 3
} as const;
type DirectionType = typeof Direction[keyof typeof Direction];

const compass: DirectionType[] = [
  Direction.North,
  Direction.South,
  Direction.East,
  Direction.West
];`;

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runCodemodAndSnapshot(testFile);
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
  Fourth: "fourth"
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
    const result = await utils.runCodemodAndSnapshot(testFile);
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
  Blue: "blue"
} as const;
type ColorType = typeof Color[keyof typeof Color];

const Status = {
  Active: 1,
  Inactive: 0
} as const;
type StatusType = typeof Status[keyof typeof Status];

const Priority = {
  Low: 0,
  Medium: 1,
  High: 2
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
    const result = await utils.runCodemodAndSnapshot(testFile);
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
  Comments: "/api/comments"
} as const;
type ApiEndpointType = typeof ApiEndpoint[keyof typeof ApiEndpoint];

const HttpMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE"
} as const;
type HttpMethodType = typeof HttpMethod[keyof typeof HttpMethod];

const ResponseStatus = {
  Success: 200,
  NotFound: 404,
  ServerError: 500
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
    const result = await utils.runCodemodAndSnapshot(testFile);
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
  Error: 3
} as const;
type LogLevelType = typeof LogLevel[keyof typeof LogLevel];

function log(level: LogLevelType, message: string): void {
  if (level >= LogLevel.Info) {
    console.log(\`[\${level}] \${message}\`);
  }
}

log(LogLevel.Error, "Something went wrong");`;

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runCodemodAndSnapshot(testFile);
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

    const expectedOutput = `/**
 * Represents different user roles in the system
 */
const UserRole = {
  /** Regular user with basic permissions */
  User: "user",
  /** Moderator with elevated permissions */
  Moderator: "moderator",
  /** Administrator with full access */
  Admin: "admin"
} as const;
type UserRoleType = typeof UserRole[keyof typeof UserRole];

// Default role for new users
const DEFAULT_ROLE: UserRoleType = UserRole.User;

/*
 * Permission check function
 */
function hasPermission(role: UserRoleType, action: string): boolean {
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
    await checkTsFile(testFile);
    assertEquals(result, expectedOutput);
  } finally {
    await utils.cleanup();
  }
});

// TODO enable if computed needs to be supported
Deno.test.ignore("handles edge case with computed enum values", async () => {
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
    console.log(result);
    await checkTsFile(testFile);
    assertEquals(result, "todo");
  } finally {
    await utils.cleanup();
  }
});

// TODO LAZINESS START
Deno.test.ignore(
  "comprehensive enum transformation - full sample",
  async () => {
    const utils = new TestUtils();
    const testFile = "comprehensive_sample.ts";

    try {
      const sampleContent = `enum Color {
  Red = "red",
  Green = "green",
  Blue = "blue",
}

enum Status {
  Pending = 0,
  Active = 1,
  Inactive = 2,
}

enum Direction {
  North = "NORTH",
  South = "SOUTH",
  East = "EAST",
  West = "WEST",
}

enum Priority {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = "CRITICAL",
}

function _getColorName(color: Color): string {
  return color;
}

function _getStatusText(status: Status): string {
  switch (status) {
    case Status.Pending:
      return "Pending";
    case Status.Active:
      return "Active";
    case Status.Inactive:
      return "Inactive";
    default:
      return "Unknown";
  }
}

interface User {
  id: number;
  name: string;
  status: Status;
  favoriteColor: Color;
}

class Navigation {
  private currentDirection: Direction = Direction.North;

  turnLeft(): void {
    switch (this.currentDirection) {
      case Direction.North:
        this.currentDirection = Direction.West;
        break;
      case Direction.West:
        this.currentDirection = Direction.South;
        break;
      case Direction.South:
        this.currentDirection = Direction.East;
        break;
      case Direction.East:
        this.currentDirection = Direction.North;
        break;
    }
  }

  getDirection(): Direction {
    return this.currentDirection;
  }
}

type TaskPriority = Priority.Low | Priority.Medium | Priority.High;

function processTask(priority: TaskPriority): void {
  console.log(\`Processing task with priority: \${priority}\`);
}

function _handleLowPriority(p: Priority.Low): void {
  console.log(\`Handling low priority task: \${p}\`);
}

const _allColors: Color[] = [Color.Red, Color.Green, Color.Blue];

const _colorMap: Record<Color, string> = {
  [Color.Red]: "#FF0000",
  [Color.Green]: "#00FF00",
  [Color.Blue]: "#0000FF",
};

function _createEnumArray<T extends string>(enumObj: Record<string, T>): T[] {
  return Object.values(enumObj);
}

const _user: User = {
  id: 1,
  name: "John",
  status: Status.Active,
  favoriteColor: Color.Blue,
};

const navigation = new Navigation();
navigation.turnLeft();
console.log(navigation.getDirection());

processTask(Priority.High);

export { Color, Status, Direction, Priority };
export type { User, TaskPriority };`;

      await utils.createTestFile(testFile, sampleContent);
      const result = await utils.runCodemodAndSnapshot(testFile);
      await checkTsFile(testFile);
      assertEquals(result, "todo");
    } finally {
      await utils.cleanup();
    }
  }
);

Deno.test.ignore(
  "enum usage in destructuring and object patterns",
  async () => {
    const utils = new TestUtils();
    const testFile = "destructuring_test.ts";

    try {
      const originalContent = `enum Theme {
  Light = "light",
  Dark = "dark",
  Auto = "auto"
}

enum Size {
  Small = "sm",
  Medium = "md",
  Large = "lg"
}

interface ComponentProps {
  theme: Theme;
  size: Size;
  disabled?: boolean;
}

function createComponent({ 
  theme = Theme.Light, 
  size = Size.Medium, 
  disabled = false 
}: Partial<ComponentProps> = {}): ComponentProps {
  return { theme, size, disabled };
}

const config = {
  defaultTheme: Theme.Dark,
  availableSizes: [Size.Small, Size.Medium, Size.Large],
  themeColors: {
    [Theme.Light]: "#ffffff",
    [Theme.Dark]: "#000000",
    [Theme.Auto]: "inherit"
  }
};

const { defaultTheme, availableSizes } = config;

function handleThemeChange(newTheme: Theme): void {
  const themes: Record<Theme, () => void> = {
    [Theme.Light]: () => console.log("Switching to light theme"),
    [Theme.Dark]: () => console.log("Switching to dark theme"), 
    [Theme.Auto]: () => console.log("Using system theme")
  };
  
  themes[newTheme]?.();
}`;

      await utils.createTestFile(testFile, originalContent);
      const result = await utils.runCodemodAndSnapshot(testFile);
      await checkTsFile(testFile);
      assertEquals(result, "todo");
    } finally {
      await utils.cleanup();
    }
  }
);

Deno.test.ignore(
  "enum usage in template literals and conditionals",
  async () => {
    const utils = new TestUtils();
    const testFile = "templates_conditionals_test.ts";

    try {
      const originalContent = `enum LogLevel {
  Debug = 0,
  Info = 1,
  Warning = 2,
  Error = 3
}

enum Environment {
  Development = "dev",
  Staging = "staging", 
  Production = "prod"
}

class Logger {
  constructor(
    private level: LogLevel = LogLevel.Info,
    private env: Environment = Environment.Development
  ) {}

  log(level: LogLevel, message: string): void {
    if (level >= this.level) {
      const prefix = \`[\${Environment[this.env] || this.env}][\${LogLevel[level]}]\`;
      console.log(\`\${prefix} \${message}\`);
    }
  }

  debug(msg: string) { this.log(LogLevel.Debug, msg); }
  info(msg: string) { this.log(LogLevel.Info, msg); }
  warn(msg: string) { this.log(LogLevel.Warning, msg); }
  error(msg: string) { this.log(LogLevel.Error, msg); }
}

function getLogLevelName(level: LogLevel): string {
  return level === LogLevel.Debug ? "Debug Mode" :
         level === LogLevel.Info ? "Information" :
         level === LogLevel.Warning ? "Warning!" :
         level === LogLevel.Error ? "ERROR!" : "Unknown";
}

const logger = new Logger(
  LogLevel.Warning, 
  Environment.Production
);

const isProduction = logger['env'] === Environment.Production;
const isDevelopment = logger['env'] === Environment.Development;

logger.error(\`Critical error in \${Environment.Production} environment\`);`;

      await utils.createTestFile(testFile, originalContent);
      const result = await utils.runCodemodAndSnapshot(testFile);
      await checkTsFile(testFile);
      assertEquals(result, "todo");
    } finally {
      await utils.cleanup();
    }
  }
);

Deno.test.ignore("enum usage with generics and type constraints", async () => {
  const utils = new TestUtils();
  const testFile = "generics_test.ts";

  try {
    const originalContent = `enum EntityType {
  User = "user",
  Group = "group", 
  Organization = "org"
}

enum Permission {
  Read = 1,
  Write = 2,
  Delete = 4,
  Admin = 8
}

interface Entity<T extends EntityType> {
  id: string;
  type: T;
  name: string;
  permissions: Permission[];
}

type UserEntity = Entity<EntityType.User>;
type GroupEntity = Entity<EntityType.Group>;

class EntityManager<T extends EntityType> {
  private entities: Map<string, Entity<T>> = new Map();

  create<K extends T>(type: K, id: string, name: string): Entity<K> {
    const entity: Entity<K> = {
      id,
      type,
      name,
      permissions: [Permission.Read]
    };
    
    this.entities.set(id, entity as Entity<T>);
    return entity;
  }

  hasPermission(id: string, permission: Permission): boolean {
    const entity = this.entities.get(id);
    return entity?.permissions.includes(permission) ?? false;
  }

  grantPermission(id: string, permission: Permission): void {
    const entity = this.entities.get(id);
    if (entity && !entity.permissions.includes(permission)) {
      entity.permissions.push(permission);
    }
  }
}

function createUserManager(): EntityManager<EntityType.User> {
  return new EntityManager<EntityType.User>();
}

const userManager = createUserManager();
const user = userManager.create(EntityType.User, "u1", "John Doe");

userManager.grantPermission("u1", Permission.Write | Permission.Delete);

function checkEntityType<T extends EntityType>(
  entity: Entity<T>
): entity is Entity<EntityType.User> {
  return entity.type === EntityType.User;
}`;

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runCodemodAndSnapshot(testFile);
    await checkTsFile(testFile);
    assertEquals(result, "todo");
  } finally {
    await utils.cleanup();
  }
});
// TODO LAZINESS END

Deno.test(
  "enum usage with arrays, maps and complex data structures",
  async () => {
    const utils = new TestUtils();
    const testFile = "data_structures_test.ts";

    try {
      const originalContent = `enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  InternalServerError = 500
}

enum HttpMethod {
  GET = "GET",
  POST = "POST", 
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH"
}

type ApiEndpoint = {
  path: string;
  method: HttpMethod;
  expectedStatus: HttpStatus[];
};

const endpoints: Map<string, ApiEndpoint> = new Map([
  ["getUser", { 
    path: "/users/:id", 
    method: HttpMethod.GET, 
    expectedStatus: [HttpStatus.OK, HttpStatus.NotFound] 
  }],
  ["createUser", { 
    path: "/users", 
    method: HttpMethod.POST, 
    expectedStatus: [HttpStatus.Created, HttpStatus.BadRequest] 
  }],
  ["updateUser", { 
    path: "/users/:id", 
    method: HttpMethod.PUT, 
    expectedStatus: [HttpStatus.OK, HttpStatus.NotFound, HttpStatus.BadRequest] 
  }],
  ["deleteUser", { 
    path: "/users/:id", 
    method: HttpMethod.DELETE, 
    expectedStatus: [HttpStatus.OK, HttpStatus.NotFound] 
  }]
]);

const statusMessages: Record<HttpStatus, string> = {
  [HttpStatus.OK]: "Request successful",
  [HttpStatus.Created]: "Resource created successfully",
  [HttpStatus.BadRequest]: "Invalid request data",
  [HttpStatus.Unauthorized]: "Authentication required",
  [HttpStatus.NotFound]: "Resource not found", 
  [HttpStatus.InternalServerError]: "Server error occurred"
};

const allowedMethods: Set<HttpMethod> = new Set([
  HttpMethod.GET,
  HttpMethod.POST,
  HttpMethod.PUT,
  HttpMethod.DELETE
]);

function validateResponse(status: HttpStatus, method: HttpMethod): boolean {
  const successStatuses = [HttpStatus.OK, HttpStatus.Created];
  const errorStatuses = [
    HttpStatus.BadRequest, 
    HttpStatus.Unauthorized, 
    HttpStatus.NotFound,
    HttpStatus.InternalServerError
  ];
  
  return [...successStatuses, ...errorStatuses].includes(status) && 
         allowedMethods.has(method);
}

class ApiClient {
  private requestHistory: Array<{
    method: HttpMethod;
    status: HttpStatus;
    timestamp: Date;
  }> = [];

  private async makeRequest(method: HttpMethod): Promise<HttpStatus> {
    // Simulate API call
    const statuses = Object.values(HttpStatus).filter(
      (s): s is HttpStatus => typeof s === 'number'
    );
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    this.requestHistory.push({
      method,
      status: randomStatus,
      timestamp: new Date()
    });
    
    return randomStatus;
  }

  async get(): Promise<HttpStatus> { 
    return this.makeRequest(HttpMethod.GET); 
  }
  
  async post(): Promise<HttpStatus> { 
    return this.makeRequest(HttpMethod.POST); 
  }

  getRequestStats(): Record<HttpMethod, number> {
    const stats: Record<HttpMethod, number> = {
      [HttpMethod.GET]: 0,
      [HttpMethod.POST]: 0,
      [HttpMethod.PUT]: 0,
      [HttpMethod.DELETE]: 0,
      [HttpMethod.PATCH]: 0
    };

    for (const request of this.requestHistory) {
      stats[request.method]++;
    }

    return stats;
  }
}`;

      const expectedOutput = `const HttpStatus = {
  OK: 200,
  Created: 201,
  BadRequest: 400,
  Unauthorized: 401,
  NotFound: 404,
  InternalServerError: 500
} as const;
type HttpStatusType = typeof HttpStatus[keyof typeof HttpStatus];

const HttpMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH"
} as const;
type HttpMethodType = typeof HttpMethod[keyof typeof HttpMethod];

type ApiEndpoint = {
  path: string;
  method: HttpMethodType;
  expectedStatus: HttpStatusType[];
};

const endpoints: Map<string, ApiEndpoint> = new Map([
  ["getUser", { 
    path: "/users/:id", 
    method: HttpMethod.GET, 
    expectedStatus: [HttpStatus.OK, HttpStatus.NotFound] 
  }],
  ["createUser", { 
    path: "/users", 
    method: HttpMethod.POST, 
    expectedStatus: [HttpStatus.Created, HttpStatus.BadRequest] 
  }],
  ["updateUser", { 
    path: "/users/:id", 
    method: HttpMethod.PUT, 
    expectedStatus: [HttpStatus.OK, HttpStatus.NotFound, HttpStatus.BadRequest] 
  }],
  ["deleteUser", { 
    path: "/users/:id", 
    method: HttpMethod.DELETE, 
    expectedStatus: [HttpStatus.OK, HttpStatus.NotFound] 
  }]
]);

const statusMessages: Record<HttpStatusType, string> = {
  [HttpStatus.OK]: "Request successful",
  [HttpStatus.Created]: "Resource created successfully",
  [HttpStatus.BadRequest]: "Invalid request data",
  [HttpStatus.Unauthorized]: "Authentication required",
  [HttpStatus.NotFound]: "Resource not found", 
  [HttpStatus.InternalServerError]: "Server error occurred"
};

const allowedMethods: Set<HttpMethodType> = new Set([
  HttpMethod.GET,
  HttpMethod.POST,
  HttpMethod.PUT,
  HttpMethod.DELETE
]);

function validateResponse(status: HttpStatusType, method: HttpMethodType): boolean {
  const successStatuses = [HttpStatus.OK, HttpStatus.Created];
  const errorStatuses = [
    HttpStatus.BadRequest, 
    HttpStatus.Unauthorized, 
    HttpStatus.NotFound,
    HttpStatus.InternalServerError
  ];
  
  return [...successStatuses, ...errorStatuses].includes(status) && 
         allowedMethods.has(method);
}

class ApiClient {
  private requestHistory: Array<{
    method: HttpMethodType;
    status: HttpStatusType;
    timestamp: Date;
  }> = [];

  private async makeRequest(method: HttpMethodType): Promise<HttpStatusType> {
    // Simulate API call
    const statuses = Object.values(HttpStatus).filter(
      (s): s is HttpStatusType => typeof s === 'number'
    );
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    this.requestHistory.push({
      method,
      status: randomStatus,
      timestamp: new Date()
    });
    
    return randomStatus;
  }

  async get(): Promise<HttpStatusType> { 
    return this.makeRequest(HttpMethod.GET); 
  }
  
  async post(): Promise<HttpStatusType> { 
    return this.makeRequest(HttpMethod.POST); 
  }

  getRequestStats(): Record<HttpMethodType, number> {
    const stats: Record<HttpMethodType, number> = {
      [HttpMethod.GET]: 0,
      [HttpMethod.POST]: 0,
      [HttpMethod.PUT]: 0,
      [HttpMethod.DELETE]: 0,
      [HttpMethod.PATCH]: 0
    };

    for (const request of this.requestHistory) {
      stats[request.method]++;
    }

    return stats;
  }
}`;

      await utils.createTestFile(testFile, originalContent);
      const result = await utils.runCodemodAndSnapshot(testFile);
      await checkTsFile(testFile);
      assertEquals(result, expectedOutput);
    } finally {
      await utils.cleanup();
    }
  }
);

Deno.test.ignore("const enum and computed enum values", async () => {
  const utils = new TestUtils();
  const testFile = "const_computed_enum_test.ts";

  try {
    const originalContent = `const enum FilePermission {
  None = 0,
  Read = 1 << 0,
  Write = 1 << 1, 
  Execute = 1 << 2,
  All = Read | Write | Execute
}

enum ResponseCode {
  Success = 200,
  Redirect = 300,
  ClientError = 400,
  ServerError = 500,
  
  // Computed values
  NotModified = Success + 4,
  UnprocessableEntity = ClientError + 22,
  BadGateway = ServerError + 2
}

enum MathConstants {
  Zero = 0,
  One = Zero + 1,
  Two = One + 1,
  Four = Two * 2,
  Eight = Four * 2
}

function hasPermission(userPerms: FilePermission, required: FilePermission): boolean {
  return (userPerms & required) === required;
}

function checkResponseType(code: ResponseCode): string {
  if (code < ResponseCode.Redirect) return "success";
  if (code < ResponseCode.ClientError) return "redirect"; 
  if (code < ResponseCode.ServerError) return "client_error";
  return "server_error";
}

const adminPermissions: FilePermission = FilePermission.All;
const readOnlyPermissions: FilePermission = FilePermission.Read;

class PermissionChecker {
  static canWrite(perms: FilePermission): boolean {
    return hasPermission(perms, FilePermission.Write);
  }
  
  static canExecute(perms: FilePermission): boolean {
    return hasPermission(perms, FilePermission.Execute);
  }
}

const mathOperations = {
  [MathConstants.Zero]: (a: number) => 0,
  [MathConstants.One]: (a: number) => a,
  [MathConstants.Two]: (a: number) => a * 2,
  [MathConstants.Four]: (a: number) => a * 4,
  [MathConstants.Eight]: (a: number) => a * 8
};`;

    const expectedOutput = "todo";

    await utils.createTestFile(testFile, originalContent);
    const result = await utils.runCodemodAndSnapshot(testFile);
    await checkTsFile(testFile);
    assertEquals(result, expectedOutput);
  } finally {
    await utils.cleanup();
  }
});
