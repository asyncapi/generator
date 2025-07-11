import { Text } from "@asyncapi/generator-react-sdk";


export default function HandleError(){
    return(
    <Text newLines={2} indent={2}>
{`@OnError
public void onError(Throwable throwable) {
    Log.error("Websocket connection error: " + throwable.getMessage());
}
`}
    </Text>
    );
}

