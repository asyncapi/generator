
import { Text } from '@asyncapi/generator-react-sdk';

export default function CloseConnector( ) {

    return (
        <Text>
            {`
            // Close the connection gracefully
            connection.closeAndAwait();
            Log.info("Connection closed gracefully.");
            Thread.sleep(1000); // Wait for a second before exiting
            System.exit(0);
        } catch (Exception e) {
              Log.error("Error during WebSocket communication", e);
              System.exit(1);
        }
    }).start();
  }
}`}
        </Text>
    );
}
