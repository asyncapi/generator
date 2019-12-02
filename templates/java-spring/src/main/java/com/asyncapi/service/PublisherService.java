package com.asyncapi.service;

import org.springframework.integration.annotation.Gateway;
import org.springframework.integration.annotation.MessagingGateway;

@MessagingGateway
public interface PublisherService {
  {%- for channelName, channel in asyncapi.channels() -%}
  {%- if channel.hasPublish() -%}

    {%- if channel.description() -%}
    /**
     * {{ channel.description() }}
     */
    {% endif %}
    @Gateway(requestChannel = "{{channel.json()['x-service-name'] | camelCase | upperFirst}}OutboundChannel")
    void publish{{channel.json()['x-service-name'] | camelCase | upperFirst}}(String data);

  {%- endif %}
  {% endfor %}
}
