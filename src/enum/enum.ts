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

  const objectMembers = enumMembers
    .map((member) => {
      const name = member.getName();
      const comment = member.getLeadingCommentRanges()[0]?.getText();
      const initializer = member.getInitializer();
      // TODO mode could be configurable to support enums with implicit numeric values
      const value = initializer ? initializer.getText() : `"${name}"`;
      const keyValue = `${name}: ${value}`;
      return comment ? comment + "\n  " + keyValue : keyValue;
    })
    .join(",\n  ") + ","; // Add trailing comma

  let objectDeclaration =
    `const ${enumName} = {\n  ${objectMembers}\n} as const;`;
  const enumComment = enumDeclaration.getLeadingCommentRanges()[0]?.getText();
  if (enumComment) {
    objectDeclaration = enumComment + "\n" + objectDeclaration;
  }

  const typeDefinition =
    `type ${enumName}Type = typeof ${enumName}[keyof typeof ${enumName}];`;

  enumDeclaration.replaceWithText(`${objectDeclaration}\n${typeDefinition}`);
}

function updateEnumReferences(sourceFile: Node, enumNames: string[]): void {
  const typeReferences = sourceFile.getDescendantsOfKind(
    SyntaxKind.TypeReference,
  );

  typeReferences.forEach((typeRef) => {
    const typeName = typeRef.getTypeName();
    if (typeName.getKind() === SyntaxKind.Identifier) {
      const identifier = typeName as Identifier;
      const name = identifier.getText();

      if (enumNames.includes(name)) {
        typeRef.replaceWithText(`${name}Type`);
      }
    }
  });

  const typeNodes = sourceFile.getDescendantsOfKind(SyntaxKind.TypeReference);

  typeNodes.forEach((typeNode) => {
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
          typeNode.replaceWithText(
            `Extract<${enumName}Type, typeof ${enumName}.${propertyName}>`,
          );
        }
      }
    }
  });
}

export function runCodemod(filePath: string): void {
  const sourceFile = project.addSourceFileAtPath(filePath);

  const enums = sourceFile.getEnums();
  const enumNames = enums.map((enumDecl) => enumDecl.getName()).filter(Boolean);

  enums.forEach(convertEnumToObject);

  updateEnumReferences(sourceFile, enumNames);

  sourceFile.saveSync();
}
