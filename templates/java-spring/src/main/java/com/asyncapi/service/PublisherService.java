{{#each asyncapi.servers}}
  {{#compare this.scheme '===' 'amqp'}}
{{> amqpPublisherService asyncapi=../../asyncapi}}
  {{/compare}}
  {{#compare this.scheme '===' 'mqtt'}}
{{> mqttPublisherService asyncapi=../../asyncapi }}
  {{/compare}}
{{/each}}
