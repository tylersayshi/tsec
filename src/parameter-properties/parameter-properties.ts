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

      const assignment = `this.${paramName} = ${paramName};`;
      constructorAssignments.push(assignment);
    }
  });

  if (propertyDeclarations.length > 0) {
    const classComment = classDeclaration.getLeadingCommentRanges()[0]
      ?.getText();
    // Get the class text and find the constructor
    const classText = classDeclaration.getText();
    const constructorMatch = classText.match(
      /constructor\s*\([^)]*\)\s*\{?\s*\}?/,
    );

    if (constructorMatch) {
      const constructorText = constructorMatch[0];
      const constructorStart = classText.indexOf(constructorText);
      const constructorEnd = constructorStart + constructorText.length;

      // Create new constructor with assignments
      const newConstructorParams = constructor.getParameters()
        .map((param) => {
          const paramName = param.getName();
          const paramType = param.getType().getText();
          const initializer = param.getInitializer()?.getText();
          return initializer
            ? `${paramName}: ${paramType} = ${initializer}`
            : `${paramName}: ${paramType}`;
        })
        .join(", ");

      const newConstructor = `constructor(${newConstructorParams}) {\n    ${
        constructorAssignments.join("\n    ")
      }\n  }`;

      // Replace constructor in class text
      const newClassText = classText.substring(0, constructorStart) +
        newConstructor +
        classText.substring(constructorEnd);

      // Add property declarations after class opening brace
      const classBraceIndex = newClassText.indexOf("{");
      if (classBraceIndex !== -1) {
        const propertiesText = propertyDeclarations.join("\n  ");
        let finalText = newClassText.substring(0, classBraceIndex + 1) +
          "\n  " + propertiesText + "\n  " +
          newClassText.substring(classBraceIndex + 1);

        if (classComment) {
          finalText = classComment + "\n" + finalText;
        }

        classDeclaration.replaceWithText(finalText);
      }
    }
  }
}

export function parameterPropertiesCodemod(filePath: string): void {
  const sourceFile = project.addSourceFileAtPath(filePath);

  const classes = sourceFile.getClasses();
  classes.forEach(convertParameterProperties);

  sourceFile.saveSync();
}
