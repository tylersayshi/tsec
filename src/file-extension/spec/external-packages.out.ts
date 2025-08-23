// External packages should remain unchanged
import { assertEquals } from "@std/assert";
import { join } from "@std/path";
import { exists } from "@std/fs";
import { Project } from "ts-morph";

// Local imports should be processed
import { User } from "./models/user.ts";

export class ExternalPackageTest {
  constructor(
    private userService: User,
  ) {}

  async testExternalPackages() {
    const project = new Project();
    const path = join("test", "file.ts");
    const fileExists = await exists(path);

    return { project, path, fileExists };
  }
}
