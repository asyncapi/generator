import { FileHeaderInfo } from "@asyncapi/generator-components";
import { getInfo, getServer } from "@asyncapi/generator-helpers";



export default async function ({ asyncapi, params }) {
    const info = getInfo(asyncapi);
    const server = getServer(asyncapi.servers(), params.server);

    return (
    <File name="Client.java">
        <FileHeaderInfo
            info={info}
            server={server}
            language="java"
        />
    </File>
    );

}
