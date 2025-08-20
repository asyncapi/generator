import { Text } from "@asyncapi/generator-react-sdk";

export default function ExampleCRD({ protocol, receiveOperations, server, version, env}) {
    const protocolEnum = protocol.toLowerCase();
    const templateType = `${protocolEnum}-template`;
    let topic = '';
     receiveOperations.map((operation) => {
            const address = operation._json.channel.address;
            topic = address.replace("{env}", env).replace("{version}", version);
     });
    let pathName = server.pathname();
    if (!pathName) {
        pathName = '/';
    }


    const topicORPathProperties = {
        "wss": `path: ${pathName},`,
        "kafka": `topic: ${topic}`
    };



    return (
        <Text>
            {`
apiVersion: asyncapi.com/v1
kind: APIConfig
metadata:
  name: ${protocolEnum}-service
  namespace: default
spec:
  protocol: ${protocolEnum}
  ${topicORPathProperties[protocolEnum]}
  templateType: ${templateType}
  config:
    replicas: 1`}
        </Text>
    );
}
