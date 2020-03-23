Prerequisites:

- docker compose

## Kafka 

Prerequisites:

- Get JDK like `brew cask install java`
- Get Kafka to be able to use its CLI `curl https://www.apache.org/dyn/closer.cgi?path=/kafka/2.4.0/kafka_2.12-2.4.0.tgz | tar -xzf`

Start Kafka `docker-compose -f kafka.yml up`

### Manual testing with generated Node.js

1. Generate server `node cli.js -o ./output ./test/docs/streetlights-kafka.yml nodejs -p server=production`
1. `cd output`
1. `nmp install`
1. `npm start`
On start, service creates in Kafka topics listed in `common.yml`.
1. Publish message from another terminal
    1. Go to the dir where you have Kafka, `cd kafka_2.12-2.4.0`
    1. Open connection to the topic `bin/kafka-console-producer.sh --broker-list localhost:9092 --topic smartylighting__streetlights__1__0__event__lighting__measured` and write a message

Message is delivered!

### Manual testing of setup without Nodejs server running
1. Go to the dir where you have Kafka, `cd kafka_2.12-2.4.0`
1. Create topic `bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic smartylighting__streetlights__1__0__event__lighting__measured`
1. Start message consumer `bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic smartylighting__streetlights__1__0__event__lighting__measured --from-beginning`
1. Publish message from another terminal `bin/kafka-console-producer.sh --broker-list localhost:9092 --topic smartylighting__streetlights__1__0__event__lighting__measured` and write a message

Message is delivered!

## RabbitMQ

Prerequisites:
- python 3 on Mac already

Start RabbitMQ `docker-compose -f rabbitmq.yml up`

### Manual testing with generated Node.js

1. Generate server `node cli.js -o ./output ./test/docs/streetlights-amqp.yml nodejs -p server=production`
1. `cd output`
1. `nmp install`
In `common.yml` you need to provide the username and password (rabbitmq:rabbitmq)
1. `npm start`
On start, service creates in RabbitMQ queue and binding between queue and the default amq.topic exchange. For routing name the channel name from the spec is used.
1. Publish message (notice the asterisk replaced with a value) from another terminal `curl http://localhost:15672/cli/rabbitmqadmin | python - publish exchange=amq.topic routing_key=smartylighting.streetlights.1.0.event.13.lighting.measured payload="hello, world" -u rabbitmq -p rabbitmq`

Message is delivered!

### Manual testing of setup without Nodejs server running

1. Declare a queue `curl http://localhost:15672/cli/rabbitmqadmin | python - declare queue name=streetlights.api.1.0.0 auto_delete=true durable=true -u rabbitmq -p rabbitmq`
1. Declare a binding of the queue (destination) to the existing default exchange (source) for topics `curl http://localhost:15672/cli/rabbitmqadmin | python - declare binding source=amq.topic destination=streetlights.api.1.0.0 routing_key=smartylighting.streetlights.1.0.event.*.lighting.measured -u rabbitmq -p rabbitmq`
1. Publish message (notice the asterisk replaced with a value) `curl http://localhost:15672/cli/rabbitmqadmin | python - publish exchange=amq.topic routing_key=smartylighting.streetlights.1.0.event.13.lighting.measured payload="hello, world" -u rabbitmq -p rabbitmq`
1. Get message `curl http://localhost:15672/cli/rabbitmqadmin | python - get queue=streetlights.api.1.0.0 -u rabbitmq -p rabbitmq`

Message is delivered!
