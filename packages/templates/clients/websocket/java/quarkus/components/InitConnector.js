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


/**
 * 
 * 1) revert back to old ( the current internal apiu endpoint)
 * 
 * 2) make another connect (idk a "ComplexConnector") so that I can connect to server which need validation etc.
 *  ( look for quarkusb - esk) 
 * 
 * 
 * 
 * Aug 5
 * 
 * Everything is connected but I am not receiving message
 * 
 * I am even sending message via webcoket on postman????
 */