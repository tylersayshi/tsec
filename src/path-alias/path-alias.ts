import { Project, SourceFile, StringLiteral, SyntaxKind } from "ts-morph";
import { dirname, join, relative } from "@std/path";
import { existsSync } from "@std/fs/exists";

const project = new Project();

interface PathMapping {
  [key: string]: string;
}

function parseTsConfigPaths(tsConfigPath: string): PathMapping {
  try {
    const tsConfigContent = Deno.readTextFileSync(tsConfigPath);
    const tsConfig = JSON.parse(tsConfigContent);
    return tsConfig.compilerOptions?.paths || {};
  } catch {
    return {};
  }
}

function findTsConfigPath(filePath: string): string | null {
  const dir = dirname(filePath);
  const possiblePaths = [
    join(dir, "tsconfig.json"),
    join(dir, "tsconfig.base.json"),
    join(dirname(dir), "tsconfig.json"),
    join(dirname(dir), "tsconfig.base.json"),
    join(dirname(dirname(dir)), "tsconfig.json"),
    join(dirname(dirname(dir)), "tsconfig.base.json"),
  ];

  for (const path of possiblePaths) {
    try {
      Deno.statSync(path);
      return path;
    } catch {
      // File doesn't exist, continue
    }
  }

  return null;
}

function pathWithExtension(path: string): string {
  const finalPath = path.split("/");
  const lastPart = finalPath.at(-1);
  if (
    lastPart?.includes(".") &&
    (!lastPart.endsWith(".ts") || !lastPart.endsWith(".tsx"))
  ) {
    finalPath[finalPath.length - 1] = lastPart.replace(/\./g, "") + ".ts";
  }
  const joined = finalPath.join("/");
  return joined.startsWith(".") ? `${joined}.ts` : `./${joined}.ts`;
}

function resolvePathAlias(
  importPath: string,
  pathMappings: PathMapping,
  currentFilePath: string,
): string | null {
  // Find the matching path mapping
  for (const [alias, targets] of Object.entries(pathMappings)) {
    // Handle array of targets (TypeScript allows multiple targets)
    const targetArray = Array.isArray(targets) ? targets : [targets];

    for (const target of targetArray) {
      // Create regex pattern for the alias
      const aliasPattern = alias.replace("*", "([^/]+)");
      const regex = new RegExp(`^${aliasPattern}$`);

      if (regex.test(importPath)) {
        // Extract the wildcard part
        const match = importPath.match(regex);
        if (!match) continue;

        const wildcardPart = match[1];

        const resolvedPath = target.replace("*", wildcardPart);

        const tsConfigPath = findTsConfigPath(currentFilePath);
        const baseDir = tsConfigPath
          ? dirname(tsConfigPath)
          : dirname(currentFilePath);

        const currentDir = dirname(currentFilePath);

        const relativePath = relative(
          currentDir,
          join(baseDir, resolvedPath),
        );

        return pathWithExtension(relativePath);
      }
    }
  }

  return null;
}

function _getPackageJsonDependencyNames(
  filePath: string,
): string[] {
  const packageJsonPath = join(dirname(filePath), "package.json");
  if (!existsSync(packageJsonPath)) {
    throw new Error(
      "package.json not found. This is required to detect external package dependencies.",
    );
  }

  const packageJson = JSON.parse(Deno.readTextFileSync(packageJsonPath));
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };
  return Object.keys(allDeps);
}

function convertPathAliases(sourceFile: SourceFile): void {
  const tsConfigPath = findTsConfigPath(sourceFile.getFilePath());
  if (!tsConfigPath) return;

  const pathMappings = parseTsConfigPaths(tsConfigPath);
  if (Object.keys(pathMappings).length === 0) return;

  // Handle import declarations
  const importDeclarations = sourceFile.getImportDeclarations();

  importDeclarations.forEach((importDecl) => {
    const moduleSpecifier = importDecl.getModuleSpecifier();

    if (moduleSpecifier.getKind() === SyntaxKind.StringLiteral) {
      const importPath = (moduleSpecifier as StringLiteral).getLiteralValue();

      if (
        importPath.startsWith(".") || importPath.startsWith("/") ||
        !importPath.includes("/") || importPath.includes("node_modules")
        // Common external packages that shouldn't be transformed
        // TODO use package.json to detect external packages
      ) {
        return;
      }

      const relativePath = resolvePathAlias(
        importPath,
        pathMappings,
        sourceFile.getFilePath(),
      );

      if (relativePath) {
        moduleSpecifier.replaceWithText(`"${relativePath}"`);
      }
    }
  });

  const exportDeclarations = sourceFile.getExportDeclarations();

  exportDeclarations.forEach((exportDecl) => {
    const moduleSpecifier = exportDecl.getModuleSpecifier();

    if (
      moduleSpecifier && moduleSpecifier.getKind() === SyntaxKind.StringLiteral
    ) {
      const exportPath = (moduleSpecifier as StringLiteral).getLiteralValue();

      // Skip if it's already a relative path or external package
      if (
        exportPath.startsWith(".") || exportPath.startsWith("/") ||
        !exportPath.includes("/") || exportPath.includes("node_modules")
        // Common external packages that shouldn't be transformed
        // TODO use package.json to detect external packages
      ) {
        return;
      }

      const relativePath = resolvePathAlias(
        exportPath,
        pathMappings,
        sourceFile.getFilePath(),
      );

      if (relativePath) {
        moduleSpecifier.replaceWithText(`"${relativePath}"`);
      }
    }
  });

  const callExpressions = sourceFile.getDescendantsOfKind(
    SyntaxKind.CallExpression,
  );

  callExpressions.forEach((callExpr) => {
    const expression = callExpr.getExpression();
    if (expression.getText() === "import") {
      const arguments_ = callExpr.getArguments();
      if (arguments_.length > 0) {
        const firstArg = arguments_[0];
        if (firstArg.getKind() === SyntaxKind.StringLiteral) {
          const importPath = (firstArg as StringLiteral).getLiteralValue();

          // Common external packages that shouldn't be transformed
          // TODO use package.json to detect external packages
          if (!importPath.includes("/")) {
            return;
          }

          if (
            importPath.startsWith(".") ||
            !importPath.includes("/")
          ) {
            firstArg.replaceWithText(`"${pathWithExtension(importPath)}"`);
            return;
          }

          const relativePath = resolvePathAlias(
            importPath,
            pathMappings,
            sourceFile.getFilePath(),
          );

          if (relativePath) {
            firstArg.replaceWithText(`"${relativePath}"`);
          }
        }
      }
    }
  });
}

export function pathAliasCodemod(filePath: string): void {
  // const packageNames = getPackageJsonDependencyNames("todo");
  const sourceFile = project.addSourceFileAtPath(filePath);

  convertPathAliases(sourceFile);

  sourceFile.saveSync();
}
