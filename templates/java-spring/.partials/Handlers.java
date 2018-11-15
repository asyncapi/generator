package com.asyncapi.service;

import com.asyncapi.infrastructure.Bindings;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.stereotype.Component;

@Component
public class Handlers {

{{#each asyncapi.topics as |topic |}}
  {{#if topic.publish}}
    @StreamListener(Bindings.{{javaConst topic.publish.x-operation-id}})
    public void handle{{capitalize topic.publish.x-operation-id}}(String message) {
        System.out.println("Received: " + message);
    }
{{/if}}
{{/each}}

}
