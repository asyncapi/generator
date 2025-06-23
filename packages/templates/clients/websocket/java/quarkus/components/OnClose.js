import { Text } from '@asyncapi/generator-react-sdk';


export default function OnClose({ title }) {
 
  return (
<Text newLines={1}>
{`
  @OnClose
  public void onClose() {
      Log.info("Websocket connection diconnected from " + "${title}");
  }
}

`}
</Text>
  );
}