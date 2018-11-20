package com.asyncapi.service;

import org.springframework.integration.annotation.Gateway;
import org.springframework.integration.annotation.MessagingGateway;

@MessagingGateway
public interface PublisherService {

  {{#each asyncapi.topics as |topic key|}}
  {{#if topic.publish}}

    @Gateway(requestChannel = "{{camelCase topic.x-service-name}}OutboundChannel")
    void publish{{capitalize topic.x-service-name}}(String data);
  {{/if}}
  {{/each}}
}
