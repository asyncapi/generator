import { Text } from '@asyncapi/generator-react-sdk';
import TimedConnection from './TimedConnection';
import URIParams from './URIParams';
import { CloseConnection } from '@asyncapi/generator-components';

export default function InitConnector({ queryParamsArray, pathName }) {
  return (
    <Text>
      {`
  @PostConstruct
  void openAndSendMessagesWithDelay() {
      new Thread(() -> {
          try {
            Log.info("Starting WebSocket connection attempt...");`}
      {
        (!queryParamsArray || queryParamsArray.length === 0) && (
          <TimedConnection />
        )
      }
      <URIParams queryParamsArray={queryParamsArray} pathName={pathName} />
      <CloseConnection language="java" framework="quarkus" methodName="" indent={0} />
    </Text>
  );
}