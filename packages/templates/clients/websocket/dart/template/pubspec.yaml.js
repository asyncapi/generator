import { File, Text } from '@asyncapi/generator-react-sdk';

export default function () {
  return (
    <File name="pubspec.yaml">
      <Text>
        {`name: wsclient
environment:
  sdk: '>=3.0.0 <4.0.0'
dependencies:
  web_socket_channel: ^3.0.2`
        }
      </Text>
    </File>
  );
}
