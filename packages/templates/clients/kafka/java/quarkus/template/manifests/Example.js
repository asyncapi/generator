import { getServer } from "@asyncapi/generator-helpers";
import ExampleCRD from "../../components/ExampleCRD";
import { File } from "@asyncapi/generator-react-sdk";


export default async function ({ asyncapi, params }) {
    const server = getServer(asyncapi.servers(), params.server);
    let serverProtocol = server.protocol();
    if (!serverProtocol) {
        throw new Error('Protocol is not defined in server configuration.');
    }
    if (serverProtocol.toLowerCase() === 'wss') {
        serverProtocol = 'websocket';
    }
    const receiveOperations = asyncapi.operations().filterByReceive();



    return (
        <File name="example.yaml">
           <ExampleCRD protocol={serverProtocol} receiveOperations={receiveOperations} server={server} env={params.env} version={params.version} />
        </File>
    );
}