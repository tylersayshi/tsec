import {
  EnumDeclaration,
  Identifier,
  Node,
  Project,
  SyntaxKind,
} from "ts-morph";

const project = new Project();

function convertEnumToObject(enumDeclaration: EnumDeclaration): void {
  const enumName = enumDeclaration.getName();
  if (!enumName) return;

  const enumMembers = enumDeclaration.getMembers();

  // Create the object literal
  const objectMembers = enumMembers
    .map((member) => {
      const name = member.getName();
      const comment = member.getLeadingCommentRanges()[0]?.getText();
      const initializer = member.getInitializer();
      // TODO mode should be configurable to support enums with implicit numeric values
      const value = initializer ? initializer.getText() : `"${name}"`;
      const keyValue = `${name}: ${value}`;
      return comment ? comment + "\n  " + keyValue : keyValue;
    })
    .join(",\n  ") + ","; // Add trailing comma

  // Create the object declaration
  let objectDeclaration =
    `const ${enumName} = {\n  ${objectMembers}\n} as const;`;
  const enumComment = enumDeclaration.getLeadingCommentRanges()[0]?.getText();
  if (enumComment) {
    objectDeclaration = enumComment + "\n" + objectDeclaration;
  }

  // Create the type definition
  const typeDefinition =
    `type ${enumName}Type = typeof ${enumName}[keyof typeof ${enumName}];`;

  // Replace the enum with object and type
  enumDeclaration.replaceWithText(`${objectDeclaration}\n${typeDefinition}`);
}

function updateEnumReferences(sourceFile: Node, enumNames: string[]): void {
  // Find all type references that reference enums
  const typeReferences = sourceFile.getDescendantsOfKind(
    SyntaxKind.TypeReference,
  );

  typeReferences.forEach((typeRef) => {
    const typeName = typeRef.getTypeName();
    if (typeName.getKind() === SyntaxKind.Identifier) {
      const identifier = typeName as Identifier;
      const name = identifier.getText();

      // Check if this is a reference to a converted enum
      if (enumNames.includes(name)) {
        // This is a reference to an enum, update it to use the new type
        typeRef.replaceWithText(`${name}Type`);
      }
    }
  });

  // Find all union types that might contain enum value references
  // Update all type nodes that reference enum values (not just unions)
  const typeNodes = sourceFile.getDescendantsOfKind(SyntaxKind.TypeReference);

  typeNodes.forEach((typeNode) => {
    // We want to find type references of the form EnumName.Property
    // In ts-morph, these are QualifiedName nodes inside TypeReferenceNode
    const typeName = typeNode.getTypeName();
    if (typeName.getKind() === SyntaxKind.QualifiedName) {
      // deno-lint-ignore no-explicit-any
      const qualifiedName = typeName as any;
      const left = qualifiedName.getLeft();
      const right = qualifiedName.getRight();
      if (
        left.getKind() === SyntaxKind.Identifier &&
        right.getKind() === SyntaxKind.Identifier
      ) {
        const enumName = left.getText();
        const propertyName = right.getText();

        if (enumNames.includes(enumName)) {
          // Replace the type node with Extract<EnumType, 'Property'>
          typeNode.replaceWithText(
            `Extract<${enumName}Type, typeof ${enumName}.${propertyName}>`,
          );
        }
      }
    }
  });
}

function runCodemod(filePath: string): void {
  const sourceFile = project.addSourceFileAtPath(filePath);
  // Get all enums before conversion and store their names
  const enums = sourceFile.getEnums();
  const enumNames = enums.map((enumDecl) => enumDecl.getName()).filter(Boolean);

  // console.log(`Found enums: ${enumNames.join(", ")}`);

  enums.forEach(convertEnumToObject);

  updateEnumReferences(sourceFile, enumNames);

  // Save the changes
  sourceFile.saveSync();
}

// Export the main function
export { runCodemod };

// Main execution
if (import.meta.main) {
  const filePath = Deno.args[0];
  if (!filePath) {
    console.error("Please provide a file path as an argument");
    Deno.exit(1);
  }
  runCodemod(filePath);
  console.log(`Successfully converted enums in ${filePath}`);
}
