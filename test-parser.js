const fs = require('fs');
const path = require('path');
const parser = require('./apps/generator/lib/parser');

// Example AsyncAPI file path (YAML or JSON)
const asyncapiPath = path.resolve(__dirname, './example-asyncapi.yml');
const asyncapi = fs.readFileSync(asyncapiPath, 'utf8');

// Mock generator object
const generator = {
  templateConfig: {
    apiVersion: 'v3'
  },
  mapBaseUrlToFolder: null
};

// Mock old options
const oldOptions = {
  applyTraits: true,
  path: asyncapiPath,
  resolve: {}
};

(async () => {
  try {
    const { document, diagnostics } = await parser.parse(asyncapi, oldOptions, generator);
    console.log('✅ Parse successful!');
    console.log('Document version:', document.version());
    console.log('Channels:', [...document.channels().keys()]);
    if (diagnostics.length > 0) {
      console.warn('⚠️ Diagnostics:', diagnostics);
    }
  } catch (err) {
    console.error('❌ Parse failed:', err);
  }
})();
