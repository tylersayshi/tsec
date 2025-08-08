import { Project, SyntaxKind } from "ts-morph";

const project = new Project();
const sourceFile = project.addSourceFileAtPath("sample_backup.ts");

// Find all union types
const unionTypes = sourceFile.getDescendantsOfKind(SyntaxKind.UnionType);

console.log(`Found ${unionTypes.length} union types`);

unionTypes.forEach((unionType, index) => {
  console.log(`\nUnion type ${index + 1}:`);
  console.log(`Text: ${unionType.getText()}`);

  const types = unionType.getTypeNodes();
  console.log(`Number of type nodes: ${types.length}`);

  types.forEach((typeNode, typeIndex) => {
    console.log(`  Type ${typeIndex + 1}:`);
    console.log(`    Kind: ${typeNode.getKind()}`);
    console.log(`    Text: ${typeNode.getText()}`);

    if (typeNode.getKind() === SyntaxKind.PropertyAccessExpression) {
      console.log(`    Is PropertyAccessExpression: true`);
      const propAccess = typeNode as any;
      const expression = propAccess.getExpression();
      console.log(`    Expression kind: ${expression.getKind()}`);
      console.log(`    Expression text: ${expression.getText()}`);
      console.log(`    Property name: ${propAccess.getNameNode().getText()}`);
    }
  });
});

// Also check for type aliases that might contain union types
const typeAliases = sourceFile.getTypeAliases();
console.log(`\nFound ${typeAliases.length} type aliases`);

typeAliases.forEach((typeAlias, index) => {
  console.log(`\nType alias ${index + 1}: ${typeAlias.getName()}`);
  console.log(`Text: ${typeAlias.getText()}`);

  const typeNode = typeAlias.getTypeNode();
  if (typeNode) {
    console.log(`Type node kind: ${typeNode.getKind()}`);
    console.log(`Type node text: ${typeNode.getText()}`);
  }
});
