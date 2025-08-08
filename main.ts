import {
  Project,
  SyntaxKind,
  Node,
  EnumDeclaration,
  Identifier,
} from "ts-morph";

const project = new Project();

function convertEnumToObject(enumDeclaration: EnumDeclaration): void {
  const enumName = enumDeclaration.getName();
  if (!enumName) return;

  // const sourceFile = enumDeclaration.getSourceFile();
  const enumMembers = enumDeclaration.getMembers();

  // Create the object literal
  const objectMembers = enumMembers
    .map((member) => {
      const name = member.getName();
      const initializer = member.getInitializer();
      const value = initializer ? initializer.getText() : member.getValue();
      return `${name}: ${value}`;
    })
    .join(",\n  ");

  // Create the object declaration
  const objectDeclaration = `const ${enumName} = {\n  ${objectMembers}\n} as const;`;

  // Create the type definition
  const typeDefinition = `type ${enumName} = typeof ${enumName}[keyof typeof ${enumName}];`;

  // Replace the enum with object and type
  enumDeclaration.replaceWithText(`${objectDeclaration}\n\n${typeDefinition}`);
}

function updateEnumReferences(sourceFile: Node, enumNames: string[]): void {
  // Find all type references that reference enums
  const typeReferences = sourceFile.getDescendantsOfKind(
    SyntaxKind.TypeReference
  );

  typeReferences.forEach((typeRef) => {
    const typeName = typeRef.getTypeName();
    if (typeName.getKind() === SyntaxKind.Identifier) {
      const identifier = typeName as Identifier;
      const name = identifier.getText();

      // Check if this is a reference to a converted enum
      if (enumNames.includes(name)) {
        // This is a reference to an enum, update it to use the new type
        typeRef.replaceWithText(name);
      }
    }
  });
}

function updateEnumValueReferences(
  sourceFile: Node,
  enumNames: string[]
): void {
  // Find all property access expressions that might be enum value references
  const propertyAccesses = sourceFile.getDescendantsOfKind(
    SyntaxKind.PropertyAccessExpression
  );

  propertyAccesses.forEach((propAccess) => {
    const expression = propAccess.getExpression();
    if (expression.getKind() === SyntaxKind.Identifier) {
      const identifier = expression as Identifier;
      const name = identifier.getText();

      // Check if this is a reference to a converted enum
      if (enumNames.includes(name)) {
        // This is a reference to an enum value, update it to use the new object
        propAccess.replaceWithText(propAccess.getText());
      }
    }
  });
}

function runCodemod(filePath: string): void {
  const sourceFile = project.addSourceFileAtPath(filePath);

  // Get all enums before conversion
  const enums = sourceFile.getEnums();
  const enumNames = enums
    .map((enumDecl) => enumDecl.getName())
    .filter(Boolean) as string[];

  // Convert all enums to objects
  enums.forEach(convertEnumToObject);

  // Update references after conversion
  updateEnumReferences(sourceFile, enumNames);
  updateEnumValueReferences(sourceFile, enumNames);

  // Save the changes
  sourceFile.saveSync();
}

// Export the main function
export { runCodemod };
