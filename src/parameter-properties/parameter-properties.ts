import {
  ClassDeclaration,
  OptionalKind,
  Project,
  PropertyDeclarationStructure,
  SyntaxKind,
} from "ts-morph";

const project = new Project();

function convertParameterProperties(classDeclaration: ClassDeclaration): void {
  const constructors = classDeclaration.getConstructors();
  if (constructors.length === 0) return;

  const constructor = constructors[0];
  const parameters = constructor.getParameters();
  const constructorContent = constructor.getBody()?.getText().slice(1, -1)
    .trim();
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

  const propertyDeclarations: OptionalKind<PropertyDeclarationStructure>[] = [];
  const constructorAssignments: string[] = [];

  parameterProperties.forEach((param) => {
    const paramName = param.getName();
    const paramType = param.getType().getText();
    const modifiers = param.getModifiers().map((mod) => mod.getText()).join(
      " ",
    );

    if (!existingProperties.includes(paramName)) {
      // const propertyDeclaration = `${modifiers} ${paramName}: ${paramType};`;
      propertyDeclarations.push({
        name: `${modifiers} ${paramName}`,
        type: paramType,
      });

      const assignment = `this.${paramName} = ${paramName};`;
      constructorAssignments.push(assignment);
    }
  });

  if (propertyDeclarations.length > 0) {
    const constructorMatch = constructor.getText();

    if (constructorMatch) {
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

      if (constructorContent) {
        constructorAssignments.unshift(constructorContent);
      }

      const newConstructor = `constructor(${newConstructorParams}) {\n    ${
        constructorAssignments.join("\n")
      }\n  }`;

      constructor.replaceWithText(newConstructor);
      classDeclaration.setOrder;

      classDeclaration.insertProperties(0, propertyDeclarations);
    }
  }
}

export function parameterPropertiesCodemod(filePath: string): void {
  const sourceFile = project.addSourceFileAtPath(filePath);

  const classes = sourceFile.getClasses();
  classes.forEach(convertParameterProperties);

  sourceFile.saveSync();
}
