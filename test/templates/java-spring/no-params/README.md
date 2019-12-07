<h1 align="center">Java Spring generator</h1>
<p align="center">
  <em>Use your AsyncAPI definition to generate java code to subscribe and publish messages</em>
</p>
<br><br>

## Usage

### AsyncAPI extensions
In order for the generator to know what names to use for some methods it's necessary to make use of [AsyncAPI specification extensions](https://www.asyncapi.com/v1/spec.html#Specification-Extensions). The extension to use is **x-service-name** and must be applied to all topics.

here is an example of how to use it:
```yml
topics:
  event.lighting.measured:
    x-service-name: measures
    publish:
      $ref: '#/components/messages/lightMeasured'
    subscribe:
      $ref: '#/components/messages/lightMeasured'
```
here is a complete example
```yml
asyncapi: '1.0.0'
info:
  title: Streetlights API
  version: '1.0.0'
  description: |
    The Smartylighting Streetlights API allows you
    to remotely manage the city lights.
  license:
    name: Apache 2.0
    url: 'https://www.apache.org/licenses/LICENSE-2.0'
baseTopic: smartylighting.streetlights.1.0
servers:
  - url: test.mosquitto.org
    scheme: mqtt
    description: Test broker
    variables:
      port:
        description: Secure connection (TLS) is available through port 8883.
        default: '1883'
        enum:
          - '1883'
          - '8883'
topics:
  event.lighting.measured:
    x-service-name: measures
    publish:
      $ref: '#/components/messages/lightMeasured'
    subscribe:
      $ref: '#/components/messages/lightMeasured'
components:
  messages:
    lightMeasured:
      summary: Inform about environmental lighting conditions for a particular streetlight.
      payload:
        $ref: "#/components/schemas/lightMeasuredPayload"
  schemas:
    lightMeasuredPayload:
      type: object
      properties:
        lumens:
          type: integer
          minimum: 0
          description: Light intensity measured in lumens.
        sentAt:
          $ref: "#/components/schemas/sentAt"
    sentAt:
      type: string
      format: date-time
      description: Date and time when the message was sent.
```
### From the command-line interface (CLI)

```bash
  Usage: ag [options] <asyncapi> java-spring

  Options:

    -V, --version                 output the version number
    -t, --templates <templateDir> directory where templates are located (defaults to internal templates directory)
    -h, --help                    output usage information
```

#### Examples

The shortest possible syntax:
```bash
ag asyncapi.yaml java-spring
```

Specify where to put the result:
```bash
ag -o ./src asyncapi.yaml java-spring
```

### Run it


Go to the root folder of the generated code and run this command (you need the JDK1.8):
```bash
./gradlew bootRun
```
