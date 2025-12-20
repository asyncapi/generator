const requireg = {
  resolve: jest.fn((pkg) => {
    if (pkg === 'npm') {
      // Return a mock path that won't cause errors
      // This simulates the path structure that requireg would return
      return '/usr/local/lib/node_modules/npm/index.js';
    }
    return undefined;
  })
};

module.exports = requireg;

