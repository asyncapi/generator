<h1 align="center">Java Spring generator</h1>
<p align="center">
  <em>Use your AsyncAPI definition to generate java code to subscribe and publish messages</em>
</p>
<br><br>

## Usage

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
{% if asyncapi.servers() | protocolExists('amqp') %}
Start your RabbitMQ with:
```bash
docker-compose -f src/main/docker/rabbitmq.yml up -d
```
{%- endif %}

Go to the root folder of the generated code and run this command (you need the JDK1.8):
```bash
./gradlew bootRun
```
