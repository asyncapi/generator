'use strict';
import PropTypes from 'prop-types';

require('source-map-support/register');
const generatorReactSdk = require('@asyncapi/generator-react-sdk');
const jsxRuntime = require('react/cjs/react-jsx-runtime.production.min');

function testFile_md ({
  asyncapi,
  params
}) {
  return /*#__PURE__*/jsxRuntime.jsxs(generatorReactSdk.File, {
    name: "test-file.md",
    children: [/*#__PURE__*/jsxRuntime.jsx(generatorReactSdk.Text, {
      children: "This is a markdown file for my application."
    }), /*#__PURE__*/jsxRuntime.jsxs(generatorReactSdk.Text, {
      children: ["App name is: **", asyncapi.info().title(), "**"]
    }), /*#__PURE__*/jsxRuntime.jsxs(generatorReactSdk.Text, {
      children: ["Version ", params.version, " running on ", params.mode, " mode "]
    })]
  });
}

//props validation
testFile_md.propTypes = {
  params: PropTypes.shape({
    version: PropTypes.string.isRequired,  
    mode: PropTypes.string.isRequired, 
  }).isRequired,
  asyncapi: PropTypes.shape({
    info: PropTypes.func.isRequired,
  }).isRequired
};

module.exports = testFile_md;
//# sourceMappingURL=test-file.md.js.map
