package com.asyncapi.service;

import org.springframework.integration.annotation.Gateway;
import org.springframework.integration.annotation.MessagingGateway;

@MessagingGateway
public interface PublisherService {
  {%- for channelName, channel in asyncapi.channels() -%}
  {%- if channel.hasPublish() -%}

    {%- if channel.description() %}
    /**
     * {{ channel.description() }}
     */
    {%- endif %}
    @Gateway(requestChannel = "{{channel.publish().id()}}OutboundChannel")
    void publish{{channel.publish().id() | upperFirst}}(String data);

  {%- endif %}
  {% endfor %}
}
