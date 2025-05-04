const fs = require('fs');
const path = require('path');
const { parse } = require('./apps/generator/lib/parser'); // Adjust path if needed
const { usesNewAPI, getProperApiDocument } = require('./apps/generator/lib/parser');

(async () => {
  const rawSpec = fs.readFileSync(path.join(__dirname, 'asyncapi.yaml'), 'utf8');

  // Simulate generator.templateConfig
  const fakeGenerator = {
    templateConfig: {
      apiVersion: '3.0.0',
    },
  };

  try {
    const { document, diagnostics } = await parse(rawSpec, {}, fakeGenerator);

    if (!document) {
      console.error('❌ Document not parsed. Diagnostics:', diagnostics);
      return;
    }

    console.log('✅ Document parsed successfully.');
    console.log('➡️ AsyncAPI Version:', document.version());
    console.log('➡️ Channels:', Object.keys(document.channels() || {}));
    console.log('➡️ Components:', Object.keys(document.components().messages() || {}));
    console.log('➡️ Uses New API?', usesNewAPI(fakeGenerator.templateConfig));
    console.log('➡️ messageId() exists:', !!document.allMessages()[0]?.messageId?.());

  } catch (err) {
    console.error('❌ Error during parsing test:', err);
  }
})();
