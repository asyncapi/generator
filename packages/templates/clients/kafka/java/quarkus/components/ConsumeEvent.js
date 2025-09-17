import { Text } from '@asyncapi/generator-react-sdk';

export default function ConsumeEvent({ eventName }) {
  return (
    <Text indent={2} newLines={2}>
      {`
    @Incoming("consumer-channel") 
    public void consume${eventName}(Record<String, String> record) {
      logger.infof("Got an event, id: %s value: %s", record.key(), record.value());
            
      // TODO: Add your business logic here for events
      // - Parse the response payload using your generated models
    }
}`}
    </Text>
            
  );
}