import { Text } from '@asyncapi/generator-react-sdk';

export function MiddleService({ channels }) {
  if (!channels || channels.length < 2) {
    return null;
  }

  return (
    <Text newLines={2}>
      {`
    @Incoming("middle-in")
    public String relayEvent(Record<String, String> record) {
        String key = null;
        try {
            Thread.sleep(1000); // simulate some work
        
            key = record.key();
            String value = record.value();
            System.out.printf("Middle service received: key=%s, value=%s%n", key, value);

            value = value + " - processed by middle service";

            Message<String> message = KafkaRecord.of(key, value);
            middleEmitter.send(message);

            return key;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.out.println("Thread was interrupted: " + e.getMessage());
        }

        return key;
        
    }`}
    </Text>
  );
}