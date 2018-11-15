package com.asyncapi.service;

import org.springframework.integration.annotation.Gateway;
import org.springframework.integration.annotation.MessagingGateway;

@MessagingGateway
public interface MqttMyGateway {

  {{#each asyncapi.topics as |topic key|}}
  {{#if topic.publish}}
  
    @Gateway(requestChannel = "{{camelCase topic.x-service-name}}OutboundChannel")
    void {{camelCase topic.publish.x-operation-id}}(String data);
  {{/if}}
  {{/each}}
}
