import { File, Text } from '@asyncapi/generator-react-sdk';

export default function({ asyncapi, params }) {
  return (
    <File name="test-file.md">
      <Text>This is a markdown file for my application.</Text>
      <Text>App name is: **{ asyncapi.info().title() }**</Text>
      <Text>Version {params.version} running on {params.mode} mode </Text>
    </File>
  );
}