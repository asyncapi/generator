// Not run on its own: scan-source-template.js and check-component-tests.js require it.
// hasReactLogic(text) tells whether a JS or JSX file branches or loops, which is what decides if a component needs a test.
const { parse } = require('@babel/parser');

// Whether this syntax tree branches: if, switch, a ternary, &&, a loop, or a .map() / .forEach() loop.
// `||` and `??` don't count, because they only set a default value.
const LOGIC_NODES = [
  'IfStatement', 'SwitchStatement', 'ConditionalExpression',
  'ForStatement', 'ForOfStatement', 'ForInStatement', 'WhileStatement', 'DoWhileStatement',
];
const LOOP_METHODS = ['map', 'forEach'];

function nodeHasLogic(node) {
  if (!node || typeof node.type !== 'string') return false;
  if (LOGIC_NODES.includes(node.type)) return true;
  if (node.type === 'LogicalExpression' && node.operator === '&&') return true;
  // `items?.map(...)` parses as OptionalCallExpression over OptionalMemberExpression.
  const isMemberCall = ['CallExpression', 'OptionalCallExpression'].includes(node.type) &&
    ['MemberExpression', 'OptionalMemberExpression'].includes(node.callee.type);
  if (isMemberCall && LOOP_METHODS.includes(node.callee.property.name)) return true;

  return Object.entries(node).some(([key, value]) => {
    if (key === 'loc') return false;
    const children = Array.isArray(value) ? value : [value];
    return children.some((child) => child && typeof child === 'object' && nodeHasLogic(child));
  });
}

// Reads the syntax tree, not the text, so "if (" or ".map(" inside generated-code strings doesn't count.
function hasReactLogic(text) {
  try {
    return nodeHasLogic(parse(text, { sourceType: 'unambiguous', plugins: ['jsx'] }).program);
  } catch (error) {
    return true; // It can't be parsed, so we can't tell: ask for a test.
  }
}

module.exports = { hasReactLogic };
