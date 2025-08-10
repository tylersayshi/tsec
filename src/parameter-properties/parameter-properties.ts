import {
  ClassDeclaration,
  ConstructorDeclaration,
  Node,
  Project,
  SyntaxKind,
} from "ts-morph";

const project = new Project();

function convertParameterProperties(classDeclaration: ClassDeclaration): void {
  const constructors = classDeclaration.getConstructors();
  if (constructors.length === 0) return;

  const constructor = constructors[0];
  const parameters = constructor.getParameters();
  const parameterProperties = parameters.filter((param) =>
    param.hasModifier(SyntaxKind.ReadonlyKeyword) ||
    param.hasModifier(SyntaxKind.PublicKeyword) ||
    param.hasModifier(SyntaxKind.PrivateKeyword) ||
    param.hasModifier(SyntaxKind.ProtectedKeyword)
  );

  if (parameterProperties.length === 0) return;

  const className = classDeclaration.getName();
  if (!className) return;

  const existingProperties = classDeclaration
    .getProperties()
    .map((property) => property.getName());

  const propertyDeclarations: string[] = [];
  const constructorAssignments: string[] = [];

  parameterProperties.forEach((param) => {
    const paramName = param.getName();
    const paramType = param.getType().getText();
    const modifiers = param.getModifiers().map((mod) => mod.getText()).join(
      " ",
    );
    const initializer = param.getInitializer()?.getText();

    if (!existingProperties.includes(paramName)) {
      const propertyDeclaration = `${modifiers} ${paramName}: ${paramType};`;
      propertyDeclarations.push(propertyDeclaration);

      const assignment = initializer
        ? `this.${paramName} = ${paramName};`
        : `this.${paramName} = ${paramName};`;
      constructorAssignments.push(assignment);
    }
  });

  if (propertyDeclarations.length > 0) {
    const classComment = classDeclaration.getLeadingCommentRanges()[0]
      ?.getText();
    const existingText = classDeclaration.getText();
    const constructorStart = existingText.indexOf("constructor(");
    const constructorEnd = existingText.lastIndexOf(")") + 1;

    const newConstructorBody = constructorAssignments.length > 0
      ? ` {\n    ${constructorAssignments.join("\n    ")}\n  }`
      : "";

    const newConstructor = existingText.substring(
      constructorStart,
      constructorEnd,
    ) + newConstructorBody;

    const newClassText = existingText.replace(
      existingText.substring(constructorStart),
      newConstructor,
    );

    const propertiesText = propertyDeclarations.join("\n  ");
    let finalText = newClassText.replace(
      /class\s+\w+\s*{/,
      `class ${className} {\n  ${propertiesText}`,
    );
    if (classComment) {
      finalText = classComment + "\n" + finalText;
    }

    classDeclaration.replaceWithText(finalText);
  }
}

export function parameterPropertiesCodemod(filePath: string): void {
  const sourceFile = project.addSourceFileAtPath(filePath);

  const classes = sourceFile.getClasses();
  classes.forEach(convertParameterProperties);

  sourceFile.saveSync();
}
