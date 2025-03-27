import { File, Text } from '@asyncapi/generator-react-sdk';

export default function () {
  return (
    <File name="requirements.txt">
      <Text>
        {`websocket-client==1.8.0
certifi==2025.1.31
requests==2.32.3`}
      </Text>
    </File>
  );
}
