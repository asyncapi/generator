import { File, Text } from '@asyncapi/generator-react-sdk';
import PropTypes from 'prop-types';

function TestFile ({ asyncapi, params }) {
  return (
    <File name="test-file.md">
      <Text>This is a markdown file for my application.</Text>
      <Text>App name is: **{ asyncapi.info().title() }**</Text>
      <Text>Version {params.version} running on {params.mode} mode </Text>
    </File>
  );
}

//props validation
TestFile.propTypes = {
  params: PropTypes.shape({
    version: PropTypes.string.isRequired,  
    mode: PropTypes.string.isRequired, 
  }).isRequired,
  asyncapi: PropTypes.shape({
    info: PropTypes.func.isRequired,
  }).isRequired
};

export default TestFile