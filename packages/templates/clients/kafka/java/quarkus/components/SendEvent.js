import { Text } from '@asyncapi/generator-react-sdk';
import { upperFirst } from '@asyncapi/generator-helpers';

export default function SendEvent({ eventName }) {
  const className = upperFirst(eventName);
    
  return (
    <Text newLines={2}>
      {`
    public String send${className}(String requestId, String value) {
      try{
          // Generate requestId if null
          if (requestId == null || requestId.trim().isEmpty()) {
              requestId = UUID.randomUUID().toString();
          }     
          
          if(value == null || value.trim().isEmpty()) {
              value = "ASYNCAPI - TEST";
          }
          Message<String> message = KafkaRecord.of(requestId, value);
          ${eventName}Emitter.send(message);
          logger.infof("Sent costing request with ID: %s and value: %s", requestId, value);
      }catch (Exception e) {
          throw new RuntimeException(String.format("Failed to produce event: %s", e.getMessage()));
      }


      return requestId;
    }
}`}
    </Text>
  );
}