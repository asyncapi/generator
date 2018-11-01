package com.asyncapi.streetlights.infrastructure;

import org.springframework.cloud.stream.annotation.Input;
import org.springframework.cloud.stream.annotation.Output;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.SubscribableChannel;

public interface Bindings {
  {{#each asyncapi.topics as |topic |}}
    {{#if topic.publish}}
    String {{javaConst topic.publish.x-operation-id}} = "input{{capFirst topic.publish.x-operation-id}}";
    {{/if}}
    {{#if topic.subscribe}}
    String {{javaConst topic.subscribe.x-operation-id}} = "output{{capFirst topic.subscribe.x-operation-id}}";
    {{/if}}
  {{/each}}
  {{#each asyncapi.topics as |topic |}}
    {{#if topic.publish}}

    @Input(Bindings.{{javaConst topic.publish.x-operation-id}})
    SubscribableChannel input{{capFirst topic.publish.x-operation-id}}();
    {{/if}}
    {{#if topic.subscribe}}

    @Output(Bindings.{{javaConst topic.subscribe.x-operation-id}})
    MessageChannel output{{capFirst topic.subscribe.x-operation-id}}();
    {{/if}}
  {{/each}}
}
