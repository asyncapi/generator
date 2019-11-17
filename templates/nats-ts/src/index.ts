
import { Client, NatsConnectionOptions, connect, Payload, NatsError, Subscription } from 'ts-nats';

{%- for channelName, channel in asyncapi.channels() %}
import * as {{ channelName | camelCase }}Channel from "./channels/{{ channelName | camelCase }}";
{%- endfor %}

{%- for messageName, message in asyncapi.components().messages() %}
import * as {{ messageName | camelCase }}Message from "./messages/{{ messageName | camelCase }}";
{%- endfor %}

export default class NatsAsyncApiClient {
  public nc?: Client;
  public options: NatsConnectionOptions;
  constructor(options : NatsConnectionOptions) {
    options = this.setDefaultOptions(options);
    this.options = options;
    this.connect(options);
  }

  /**
   * Try to connect to the NATS server.
   * @param options The connection options for NATS
   */
  private async connect(options : NatsConnectionOptions){
    try{
      this.nc = await connect(options);
    }catch(e){
      console.error("Could not connect to NATS: " + e)
    }
  }

  /**
   * Set the default options from the AsyncAPI file.
   * @param options The options to set
   */
  private setDefaultOptions(options: NatsConnectionOptions){
    //If server binding options sat set the options
    options.encoding = 'utf8';
    options.payload = Payload.BINARY;
    return options;
  }

  /**
   *  Wrapper
   * @param requestMessage The request message to send.
   */
  public testChannelRequest(requestMessage: TestRequest): Promise<TestResponse> {
    return TestRequestChannel.request(requestMessage, this.nc);
  }

  {%- for channelName, channel in asyncapi.channels() %}
    {{channel | isRequester}}
  {%- endfor %}

  /**
   *  Wrapper
   * @param requestMessage The message to publish.
   */
  public testPubPublish(requestMessage: TestRequest): Promise<void> {
    return TestPub.publish(requestMessage, this.nc);
  }

  /**
   *  Wrapper
   * @param onDataCallback Called when message recieved.
   */
  public testSubscribeSubscribe(onDataCallback : (err?: NatsError, msg?: TestRequest) => void): Promise<Subscription> {
    return TestSub.subscribe(onDataCallback, this.nc);
  }


  /**
   *  Wrapper
   * @param onRequest Called when request recieved.
   * @param onReplyError Called when it was not possible to send the reply.
   */
  public testResponseReply(onRequest : (err?: NatsError, msg?: TestRequest) => TestResponse, onReplyError : (err: NatsError) => void): Promise<Subscription> {
    return TestResponseChannel.reply(onRequest, onReplyError, this.nc);
  }
}
