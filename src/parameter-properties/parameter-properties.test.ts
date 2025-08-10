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
    const originalContent = `class User {
  constructor(public name: string, public age: number) {}
}

const user = new User("John", 30);
console.log(user.name, user.age);`;

    const expectedOutput = `class User {
  public name: string;
  public age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

const user = new User("John", 30);
console.log(user.name, user.age);
`;

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
    const originalContent = `class BankAccount {
  constructor(private balance: number, private accountNumber: string) {}
  
  getBalance(): number {
    return this.balance;
  }
  
  getAccountNumber(): string {
    return this.accountNumber;
  }
}`;

    const expectedOutput = `class BankAccount {
  private balance: number;
  private accountNumber: string;
  
  constructor(balance: number, accountNumber: string) {
    this.balance = balance;
    this.accountNumber = accountNumber;
  }
  
  getBalance(): number {
    return this.balance;
  }
  
  getAccountNumber(): string {
    return this.accountNumber;
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

Deno.test("converts readonly parameter properties", async () => {
  const utils = new TestUtils();
  const testFile = "tmp/readonly_params_test.ts";

  try {
    const originalContent = `class Configuration {
  constructor(readonly apiKey: string, readonly baseUrl: string) {}
  
  getApiKey(): string {
    return this.apiKey;
  }
  
  getBaseUrl(): string {
    return this.baseUrl;
  }
}`;

    const expectedOutput = `class Configuration {
  readonly apiKey: string;
  readonly baseUrl: string;
  
  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }
  
  getApiKey(): string {
    return this.apiKey;
  }
  
  getBaseUrl(): string {
    return this.baseUrl;
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

Deno.test("converts mixed access modifiers", async () => {
  const utils = new TestUtils();
  const testFile = "tmp/mixed_modifiers_test.ts";

  try {
    const originalContent = `class Product {
  constructor(public name: string, private price: number, protected category: string, readonly id: string) {}
  
  getName(): string {
    return this.name;
  }
  
  getPrice(): number {
    return this.price;
  }
  
  getCategory(): string {
    return this.category;
  }
  
  getId(): string {
    return this.id;
  }
}`;

    const expectedOutput = `class Product {
  public name: string;
  private price: number;
  protected category: string;
  readonly id: string;
  
  constructor(name: string, price: number, category: string, id: string) {
    this.name = name;
    this.price = price;
    this.category = category;
    this.id = id;
  }
  
  getName(): string {
    return this.name;
  }
  
  getPrice(): number {
    return this.price;
  }
  
  getCategory(): string {
    return this.category;
  }
  
  getId(): string {
    return this.id;
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

Deno.test("handles parameter properties with initializers", async () => {
  const utils = new TestUtils();
  const testFile = "tmp/initializers_test.ts";

  try {
    const originalContent = `class Settings {
  constructor(public theme: string = "dark", public language: string = "en", private debug: boolean = false) {}
  
  getTheme(): string {
    return this.theme;
  }
  
  getLanguage(): string {
    return this.language;
  }
  
  isDebug(): boolean {
    return this.debug;
  }
}`;

    const expectedOutput = `class Settings {
  public theme: string;
  public language: string;
  private debug: boolean;
  
  constructor(theme: string = "dark", language: string = "en", debug: boolean = false) {
    this.theme = theme;
    this.language = language;
    this.debug = debug;
  }
  
  getTheme(): string {
    return this.theme;
  }
  
  getLanguage(): string {
    return this.language;
  }
  
  isDebug(): boolean {
    return this.debug;
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

Deno.test("handles complex types in parameter properties", async () => {
  const utils = new TestUtils();
  const testFile = "tmp/complex_types_test.ts";

  try {
    const originalContent = `interface UserData {
  id: string;
  name: string;
  email: string;
}

type Status = "active" | "inactive" | "pending";

class UserManager {
  constructor(
    public users: UserData[],
    private statusFilter: Status,
    protected config: { maxUsers: number; timeout: number; }
  ) {}
  
  getUsers(): UserData[] {
    return this.users;
  }
  
  getStatusFilter(): Status {
    return this.statusFilter;
  }
  
  getConfig(): { maxUsers: number; timeout: number } {
    return this.config;
  }
}`;

    const expectedOutput = `interface UserData {
  id: string;
  name: string;
  email: string;
}

type Status = "active" | "inactive" | "pending";

class UserManager {
  public users: UserData[];
  private statusFilter: Status;
  protected config: { maxUsers: number; timeout: number; };
  
  constructor(users: UserData[], statusFilter: Status, config: { maxUsers: number; timeout: number; }) {
    this.users = users;
    this.statusFilter = statusFilter;
    this.config = config;
  }
  
  getUsers(): UserData[] {
    return this.users;
  }
  
  getStatusFilter(): Status {
    return this.statusFilter;
  }
  
  getConfig(): { maxUsers: number; timeout: number } {
    return this.config;
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

Deno.test("handles multiple classes in single file", async () => {
  const utils = new TestUtils();
  const testFile = "tmp/multiple_classes_test.ts";

  try {
    const originalContent = `class Person {
  constructor(public name: string, public age: number) {}
  
  introduce(): string {
    return \`Hi, I'm \${this.name} and I'm \${this.age} years old.\`;
  }
}

class Car {
  constructor(private brand: string, private model: string, public year: number) {}
  
  getBrand(): string {
    return this.brand;
  }
  
  getModel(): string {
    return this.model;
  }
  
  getYear(): number {
    return this.year;
  }
}

class Database {
  constructor(readonly connectionString: string, private maxConnections: number) {}
  
  getConnectionString(): string {
    return this.connectionString;
  }
  
  getMaxConnections(): number {
    return this.maxConnections;
  }
}`;

    const expectedOutput = `class Person {
  public name: string;
  public age: number;
  
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  
  introduce(): string {
    return \`Hi, I'm \${this.name} and I'm \${this.age} years old.\`;
  }
}

class Car {
  private brand: string;
  private model: string;
  public year: number;
  
  constructor(brand: string, model: string, year: number) {
    this.brand = brand;
    this.model = model;
    this.year = year;
  }
  
  getBrand(): string {
    return this.brand;
  }
  
  getModel(): string {
    return this.model;
  }
  
  getYear(): number {
    return this.year;
  }
}

class Database {
  readonly connectionString: string;
  private maxConnections: number;
  
  constructor(connectionString: string, maxConnections: number) {
    this.connectionString = connectionString;
    this.maxConnections = maxConnections;
  }
  
  getConnectionString(): string {
    return this.connectionString;
  }
  
  getMaxConnections(): number {
    return this.maxConnections;
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

Deno.test("preserves existing class properties", async () => {
  const utils = new TestUtils();
  const testFile = "tmp/existing_properties_test.ts";

  try {
    const originalContent = `class Employee {
  private department: string = "Engineering";
  
  constructor(public name: string, public id: number) {}
  
  getDepartment(): string {
    return this.department;
  }
  
  setDepartment(dept: string): void {
    this.department = dept;
  }
}`;

    const expectedOutput = `class Employee {
  public name: string;
  public id: number;
  
  private department: string = "Engineering";
  
  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
  
  getDepartment(): string {
    return this.department;
  }
  
  setDepartment(dept: string): void {
    this.department = dept;
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

Deno.test("handles classes without parameter properties", async () => {
  const utils = new TestUtils();
  const testFile = "tmp/no_params_test.ts";

  try {
    const originalContent = `class SimpleClass {
  private value: string;
  
  constructor(value: string) {
    this.value = value;
  }
  
  getValue(): string {
    return this.value;
  }
}

class EmptyClass {
  constructor() {}
  
  doSomething(): void {
    console.log("Hello World");
  }
}`;

    const expectedOutput = `class SimpleClass {
  private value: string;
  
  constructor(value: string) {
    this.value = value;
  }
  
  getValue(): string {
    return this.value;
  }
}

class EmptyClass {
  constructor() {}
  
  doSomething(): void {
    console.log("Hello World");
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

Deno.test("preserves comments", async () => {
  const utils = new TestUtils();
  const testFile = "tmp/comments_test.ts";

  try {
    const originalContent = `/**
 * User class with parameter properties
 */
class User {
  /**
   * Creates a new user instance
   * @param name - The user's name
   * @param age - The user's age
   */
  constructor(public name: string, public age: number) {}
  
  // Get user info
  getInfo(): string {
    return \`\${this.name} (\${this.age})\`;
  }
}`;

    const expectedOutput = `/**
 * User class with parameter properties
 */
class User {
  public name: string;
  public age: number;
  
  /**
   * Creates a new user instance
   * @param name - The user's name
   * @param age - The user's age
   */
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  
  // Get user info
  getInfo(): string {
    return \`\${this.name} (\${this.age})\`;
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

Deno.test("handles generic classes", async () => {
  const utils = new TestUtils();
  const testFile = "tmp/generic_classes_test.ts";

  try {
    const originalContent = `class Container<T> {
  constructor(private value: T, public label: string) {}
  
  getValue(): T {
    return this.value;
  }
  
  getLabel(): string {
    return this.label;
  }
}

class Pair<K, V> {
  constructor(public key: K, public value: V) {}
  
  getKey(): K {
    return this.key;
  }
  
  getValue(): V {
    return this.value;
  }
}`;

    const expectedOutput = `class Container<T> {
  private value: T;
  public label: string;
  
  constructor(value: T, label: string) {
    this.value = value;
    this.label = label;
  }
  
  getValue(): T {
    return this.value;
  }
  
  getLabel(): string {
    return this.label;
  }
}

class Pair<K, V> {
  public key: K;
  public value: V;
  
  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
  
  getKey(): K {
    return this.key;
  }
  
  getValue(): V {
    return this.value;
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

Deno.test("handles abstract classes", async () => {
  const utils = new TestUtils();
  const testFile = "tmp/abstract_classes_test.ts";

  try {
    const originalContent = `abstract class Animal {
  constructor(public name: string, protected species: string) {}
  
  abstract makeSound(): string;
  
  getName(): string {
    return this.name;
  }
  
  getSpecies(): string {
    return this.species;
  }
}

class Dog extends Animal {
  constructor(name: string, public breed: string) {
    super(name, "Canis");
  }
  
  makeSound(): string {
    return "Woof!";
  }
  
  getBreed(): string {
    return this.breed;
  }
}`;

    const expectedOutput = `abstract class Animal {
    public name: string;
    protected species: string;
    
  constructor(name: string, species: string) {
    this.name = name;
    this.species = species;
  }
  
  abstract makeSound(): string;
  
  getName(): string {
    return this.name;
  }
  
  getSpecies(): string {
    return this.species;
  }
}

class Dog extends Animal {
    public breed: string;
    
  constructor(name: string, breed: string) {
    super(name, "Canis");
    this.breed = breed;
  }
  
  makeSound(): string {
    return "Woof!";
  }
  
  getBreed(): string {
    return this.breed;
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
