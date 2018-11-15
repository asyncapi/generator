{{#each asyncapi.servers}}
  {{#compare this.scheme '===' 'amqp'}}
{{> amqpCommandLinePublisher asyncapi=../../asyncapi}}
  {{/compare}}
  {{#compare this.scheme '===' 'mqtt'}}
{{> mqttCommandLinePublisher asyncapi=../../asyncapi }}
  {{/compare}}
{{/each}}
