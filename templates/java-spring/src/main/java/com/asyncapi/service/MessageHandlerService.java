{{#each asyncapi.servers}}
  {{#compare this.scheme '===' 'amqp'}}
{{> amqpMessageHandlerService asyncapi=../../asyncapi}}
  {{/compare}}
  {{#compare this.scheme '===' 'mqtt'}}
{{> mqttMessageHandlerService asyncapi=../../asyncapi }}
  {{/compare}}
{{/each}}
