/* eslint-disable no-undef */
const path = require('path');
// this weird import are only necessary because we test within the SDK itself.
// eslint-disable-next-line security/detect-non-literal-require
const {File} = require(path.resolve(__dirname, '../../../../components'));
function greetings(name) {
  return `hello ${name}`;
}
// eslint-disable-next-line react/display-name
module.exports = function() {
  return (
    <File>
      {greetings('Test')}
    </File>
  );
};