"use strict";

require("source-map-support/register");
var generatorReactSdk = require("@asyncapi/generator-react-sdk");

function testFile_md({ asyncapi, params }) {
  return /*#__PURE__*/ jsxRuntime.jsxs(generatorReactSdk.File, {
    name: "test-file.md",
    children: [
      /*#__PURE__*/ jsxRuntime.jsx(generatorReactSdk.Text, {
        children: "This is a markdown file for my application.",
      }),
      /*#__PURE__*/ jsxRuntime.jsxs(generatorReactSdk.Text, {
        children: ["App name is: **", asyncapi.info().title(), "**"],
      }),
      /*#__PURE__*/ jsxRuntime.jsxs(generatorReactSdk.Text, {
        children: [
          "Version ",
          params.version,
          " running on ",
          params.mode,
          " mode ",
        ],
      }),
    ],
  });
}

module.exports = testFile_md;
//# sourceMappingURL=test-file.md.js.map
