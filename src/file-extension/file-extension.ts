import {
  CallExpression,
  ImportDeclaration,
  Project,
  StringLiteral,
  SyntaxKind,
} from "ts-morph";

const project = new Project();

function updateImportPath(importDeclaration: ImportDeclaration): void {
  const moduleSpecifier = importDeclaration.getModuleSpecifier();

  if (moduleSpecifier.getKind() !== SyntaxKind.StringLiteral) {
    return;
  }

  const stringLiteral = moduleSpecifier as StringLiteral;
  const importPath = stringLiteral.getLiteralValue();

  // Skip if it's not a relative import or doesn't need extension changes
  if (!importPath.startsWith("./") && !importPath.startsWith("../")) {
    return;
  }

  // Handle .js extension replacement
  if (importPath.endsWith(".js")) {
    const newPath = importPath.slice(0, -3) + ".ts";
    stringLiteral.setLiteralValue(newPath);
    return;
  }

  // Handle no extension - add .ts
  // Only add .ts if the path doesn't already have an extension
  // Check if the path ends with a file extension (after the last slash)
  const lastSlashIndex = importPath.lastIndexOf("/");
  const fileName = lastSlashIndex >= 0
    ? importPath.slice(lastSlashIndex + 1)
    : importPath;
  const hasExtension = fileName.includes(".");

  if (!hasExtension) {
    const newPath = importPath + ".ts";
    stringLiteral.setLiteralValue(newPath);
    return;
  }
}

function updateDynamicImport(callExpression: CallExpression): void {
  const arguments_ = callExpression.getArguments();
  if (arguments_.length === 0) return;

  const firstArg = arguments_[0];
  if (firstArg.getKind() !== SyntaxKind.StringLiteral) {
    return;
  }

  const stringLiteral = firstArg as StringLiteral;
  const importPath = stringLiteral.getLiteralValue();

  // Skip if it's not a relative import or doesn't need extension changes
  if (!importPath.startsWith("./") && !importPath.startsWith("../")) {
    return;
  }

  // Handle .js extension replacement
  if (importPath.endsWith(".js")) {
    const newPath = importPath.slice(0, -3) + ".ts";
    stringLiteral.setLiteralValue(newPath);
    return;
  }

  // Handle no extension - add .ts
  // Only add .ts if the path doesn't already have an extension
  // Check if the path ends with a file extension (after the last slash)
  const lastSlashIndex = importPath.lastIndexOf("/");
  const fileName = lastSlashIndex >= 0
    ? importPath.slice(lastSlashIndex + 1)
    : importPath;
  const hasExtension = fileName.includes(".");

  if (!hasExtension) {
    const newPath = importPath + ".ts";
    stringLiteral.setLiteralValue(newPath);
    return;
  }
}

export function fileExtensionCodemod(filePath: string): void {
  const sourceFile = project.addSourceFileAtPath(filePath);

  // Process static imports
  const imports = sourceFile.getImportDeclarations();
  imports.forEach(updateImportPath);

  // Process dynamic imports
  const callExpressions = sourceFile.getDescendantsOfKind(
    SyntaxKind.CallExpression,
  );
  callExpressions.forEach((callExpr) => {
    const expression = callExpr.getExpression();
    if (expression.getKind() === SyntaxKind.ImportKeyword) {
      updateDynamicImport(callExpr);
    }
  });

  sourceFile.saveSync();
}
