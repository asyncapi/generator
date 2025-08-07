import { Text } from '@asyncapi/generator-react-sdk';
import TimedConnection from './TimedConnection';
import CloseConnector from './CloseConnector';
import URIParams from './URIParams';

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
      <CloseConnector />
    </Text>
  );
}