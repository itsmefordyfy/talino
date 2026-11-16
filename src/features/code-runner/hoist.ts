/** Static scans of the syntax tree: which names a scope declares before its code runs. */
import type { AnyNode, Pattern, Statement } from 'acorn';

export function patternNames(pattern: AnyNode | null | undefined, out: string[]) {
  if (!pattern) return;
  switch (pattern.type) {
    case 'Identifier': out.push(pattern.name); break;
    case 'ObjectPattern': for (const p of pattern.properties) patternNames(p.type === 'RestElement' ? p.argument : p.value, out); break;
    case 'ArrayPattern': for (const e of pattern.elements) patternNames(e, out); break;
    case 'RestElement': patternNames(pattern.argument, out); break;
    case 'AssignmentPattern': patternNames(pattern.left, out); break;
    default: break;
  }
}

/** Names declared with `var` anywhere in these statements, not looking inside nested functions. */
export function collectVarNames(statements: readonly Statement[], out: string[]) {
  for (const s of statements) collectVar(s, out);
}

function collectVar(node: Statement | null | undefined, out: string[]) {
  if (!node) return;
  switch (node.type) {
    case 'VariableDeclaration':
      if (node.kind === 'var') for (const d of node.declarations) patternNames(d.id, out);
      break;
    case 'BlockStatement': collectVarNames(node.body, out); break;
    case 'IfStatement': collectVar(node.consequent, out); collectVar(node.alternate, out); break;
    case 'ForStatement':
      if (node.init && node.init.type === 'VariableDeclaration') collectVar(node.init, out);
      collectVar(node.body, out);
      break;
    case 'ForInStatement':
    case 'ForOfStatement':
      if (node.left.type === 'VariableDeclaration') collectVar(node.left, out);
      collectVar(node.body, out);
      break;
    case 'WhileStatement':
    case 'DoWhileStatement':
    case 'LabeledStatement': collectVar(node.body, out); break;
    case 'TryStatement':
      collectVar(node.block, out);
      collectVar(node.handler?.body, out);
      collectVar(node.finalizer, out);
      break;
    case 'SwitchStatement': for (const c of node.cases) collectVarNames(c.consequent, out); break;
    default: break;
  }
}

export function isPattern(node: AnyNode): node is Pattern {
  return node.type === 'ObjectPattern' || node.type === 'ArrayPattern' || node.type === 'Identifier' || node.type === 'MemberExpression' || node.type === 'AssignmentPattern' || node.type === 'RestElement';
}
