package com.asyncapi.service;

import org.springframework.integration.annotation.Gateway;
import org.springframework.integration.annotation.MessagingGateway;

@MessagingGateway
public interface PublisherService {

  {% for topicName, topic in asyncapi.topics %}
  {% if topic.publish %}

    @Gateway(requestChannel = "{{topic.x-service-name | camelCase}}OutboundChannel")
    void publish{{topic.x-service-name | capitalize}}(String data);
  {% endif %}
  {% endfor %}
}
