const arb = jest.genMockFromModule('@npmcli/arborist');
arb.prototype.reify = jest.fn(async (opt) => {
  const childrenMap = new Map();
  childrenMap.set('test', {path: './test'});
  return { children: childrenMap };
});

module.exports = arb;
