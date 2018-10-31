package com.asyncapi.streetlights.infrastructure;

import org.springframework.cloud.stream.annotation.Input;
import org.springframework.messaging.SubscribableChannel;

public interface Bindings {
    {{#each asyncapi.topics}}

    @Input("{{@key}}")
    SubscribableChannel input();
    {{/each}}

    {{#each asyncapi.topics as |topic |}}
    {{topic.serviceName}}.{{topic.publish.summary}}
    {{/each}}
    // @Input(Bindings.INPUT)
    // SubscribableChannel input();
}
