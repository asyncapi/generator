import { Text, File } from '@asyncapi/generator-react-sdk';

export default function AppProperties({ asyncapi, params }) {
  const channels = asyncapi.channels();
  const operations = asyncapi.operations();
  const receiveOperations = operations.filterByReceive();
  const sendOperations = operations.filterBySend();
  const version = params.version;
  const env = params.env;

  let producerActualTopic = '';
  let consumerActualTopic = '';



  return (
      <File name="application.properties">
        <Text>
          {`
# application.properties

# Kafka broker configuration
kafka.bootstrap.servers=localhost:9092`}
        </Text>
        {receiveOperations.length > 0 && 
          ( receiveOperations.map((operation) => {
            const address = operation._json.channel.address;
            producerActualTopic = address.replace("{env}", env).replace("{version}", version);
            return (
              <Text newLines={2}>
                {`
# Configure outgoing channel for costing requests  (writing to Kafka) - producer
mp.messaging.outgoing.producer-channel.connector=smallrye-kafka
mp.messaging.outgoing.producer-channel.topic=${producerActualTopic}
mp.messaging.outgoing.producer-channel.key.serializer=org.apache.kafka.common.serialization.StringSerializer
mp.messaging.outgoing.producer-channel.value.serializer=org.apache.kafka.common.serialization.StringSerializer`}
              </Text>
            );
          }))}
        {sendOperations.length > 0 && 
          ( sendOperations.map((operation) => {
            const address = operation._json.channel.address;
            consumerActualTopic = address.replace("{env}", env).replace("{version}", version);
            return (
              <Text newLines={2}>
                {`
# Configure incoming channel for costing responses (reading from Kafka) - consumer
mp.messaging.incoming.consumer-channel.connector=smallrye-kafka
mp.messaging.incoming.consumer-channel.topic=${consumerActualTopic}
mp.messaging.incoming.consumer-channel.key.deserializer=org.apache.kafka.common.serialization.StringDeserializer
mp.messaging.incoming.consumer-channel.value.deserializer=org.apache.kafka.common.serialization.StringDeserializer`}
              </Text>
            );
          }))}
        {channels.length > 1 && (
          <Text newLines={2}>
              {`
# Incoming: read from producer's topic
mp.messaging.incoming.middle-in.connector=smallrye-kafka
mp.messaging.incoming.middle-in.topic=${producerActualTopic}
mp.messaging.incoming.middle-in.group.id=middle-group
mp.messaging.incoming.middle-in.value.deserializer=org.apache.kafka.common.serialization.StringDeserializer
mp.messaging.incoming.middle-in.key.deserializer=org.apache.kafka.common.serialization.StringDeserializer

# Outgoing: write to consumer's topic
mp.messaging.outgoing.middle-out.connector=smallrye-kafka
mp.messaging.outgoing.middle-out.topic=${consumerActualTopic}
mp.messaging.outgoing.middle-out.value.serializer=org.apache.kafka.common.serialization.StringSerializer
mp.messaging.outgoing.middle-out.key.serializer=org.apache.kafka.common.serialization.StringSerializer`}
          </Text>
        )}
      </File>
  );
}