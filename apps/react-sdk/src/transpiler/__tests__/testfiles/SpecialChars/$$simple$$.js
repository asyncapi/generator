import path from 'path';
// this weird import are only necessary because we test within the SDK itself.
// eslint-disable-next-line security/detect-non-literal-require, no-undef
const {File} = require(path.resolve(__dirname, '../../../../components'));
const greetings = name => `hello ${name}`;
// eslint-disable-next-line react/display-name
export default function() {
  return (
    <File>
      {greetings('Test')}
    </File>
  );
}