import { getServer } from "@asyncapi/generator-helpers";
import { Text } from "@asyncapi/generator-react-sdk"

export default function AppProperties({ asyncapi, params }) {
    const sever = getServer(asyncapi.servers(), params.server);
    const host = sever.host();
    if(!host) {
        console.log("ERROR: No host found in the server configuration.");
        return null;
    }


    return (
        <File name="application.properties">
            <Text>
{`# application.properties

# Define a named connector called "echo"
quarkus.websockets-next.client.echo.url=${host}`}
            </Text>
        </File>
    );

}