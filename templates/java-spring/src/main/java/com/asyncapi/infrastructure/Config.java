{{#each asyncapi.servers}}
  {{#compare this.scheme '===' 'amqp'}}
{{> amqpConfig asyncapi=../../asyncapi}}
  {{/compare}}
  {{#compare this.scheme '===' 'mqtt'}}
{{> mqttConfig asyncapi=../../asyncapi }}
  {{/compare}}
{{/each}}
