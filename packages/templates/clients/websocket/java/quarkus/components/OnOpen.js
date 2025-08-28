import { Text } from '@asyncapi/generator-react-sdk';

export default function OnOpen({ title }) {
  return (
    <Text newLines={1} indent={2}>
      {`@OnOpen
public void onOpen() {
    String broadcastMessage = "Echo called from ${title} server";
    LOG.info("Connected to ${title} server");
    LOG.info(broadcastMessage);
}
`}
    </Text>
  );
}
