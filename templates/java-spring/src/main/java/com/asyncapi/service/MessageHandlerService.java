package com.asyncapi.service;

import org.springframework.messaging.Message;
import org.springframework.stereotype.Service;

@Service
public class MessageHandlerService {
  {%- for channelName, channel in asyncapi.channels() -%}
  {%- if channel.hasSubscribe() -%}

    {%- if channel.description() %}
    /**
     * {{ channel.description() }}
     */
    {%- endif %}
    public void handle{{channel.subscribe().id() | upperFirst}}(Message<?> message) {
        System.out.println("handler {{channel.subscribe().id()}}");
        System.out.println(message.getPayload());
    }
  {%- endif -%}
  {% endfor %}
}
