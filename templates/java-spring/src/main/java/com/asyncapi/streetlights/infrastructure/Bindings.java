package com.asyncapi.streetlights.infrastructure;

import org.springframework.cloud.stream.annotation.Input;
import org.springframework.cloud.stream.annotation.Output;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.SubscribableChannel;

public interface Bindings {
  {{#each asyncapi.topics as |topic |}}
    {{#if topic.publish}}
    String {{topic.publish.x-operation-id}} = "input{{topic.publish.x-operation-id}}";
    {{/if}}
    {{#if topic.subscribe}}
    String {{topic.subscribe.x-operation-id}} = "output{{topic.subscribe.x-operation-id}}";
    {{/if}}
  {{/each}}

  {{#each asyncapi.topics as |topic |}}
    {{#if topic.publish}}
    @Input(Bindings.{{topic.publish.x-operation-id}})
    SubscribableChannel input{{topic.publish.x-operation-id}}();
    {{/if}}

    {{#if topic.subscribe}}
    @Output(Bindings.{{topic.subscribe.x-operation-id}})
    MessageChannel output{{topic.subscribe.x-operation-id}}();
    {{/if}}
  {{/each}}

}
