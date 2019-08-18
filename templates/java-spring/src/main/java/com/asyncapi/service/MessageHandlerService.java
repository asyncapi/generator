package com.asyncapi.service;

import org.springframework.messaging.Message;
import org.springframework.stereotype.Service;

@Service
public class MessageHandlerService {

{% for topicName, topic in asyncapi.topics %}
  {% if topic.subscribe %}
    public void handle{{topic.x-service-name | upperFirst}}(Message<?> message) {
        System.out.println("handler {{topic.x-service-name}}");
        System.out.println(message.getPayload());
    }
  {% endif %}

{% endfor %}

}
