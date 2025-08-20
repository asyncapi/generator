import { File } from "@asyncapi/generator-react-sdk";
import APIConfig from "../../components/APIConfig";
import { getServer } from "@asyncapi/generator-helpers";



export default async function ({ asyncapi, params }) {
    const server = getServer(asyncapi.servers(), params.server);
    const serverProtocol = server.protocol();

    if (!serverProtocol) {
        throw new Error('Protocol is not defined in server configuration.');
    }

    return (
        <File name="crd.yaml">
            <APIConfig protocol={serverProtocol}/>
        </File>
    );
}