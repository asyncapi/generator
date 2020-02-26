# Templates recipes

In this document you can find recipes for templates that you might want to copy and reuse them for your need to speed up template development. Feel free to create a Pull Request with your recipe.

## Prerequisites

You must be familiar with [Nunjucks](https://mozilla.github.io/nunjucks/) templating engine and [how it is supported in the generator](./authoring.md).

## Recipes

- [Using Schema objects to generate types for a given programming language](#using-schema-objects-to-generate-types-for-a-given-programming-language)
- [Displaying separate lists for different channels operations](#displaying-separate-lists-for-different-channels-operations)

### Using Schema objects to generate types for a given programming language

* Java example where `$$schema$$.java` file looks like this:
    ```java
    package com.async.generated;

    public class {{schema.uid()}} {
        
    {%- for propertyName, property in schema.properties() %}
        public {{property.type() | toJavaType}} {{propertyName}};
    {%- endfor %}
        public {{schema.uid()}}(
        {%- set counter = 0 %}
        {%- for propertyName, property in schema.properties() %}
            {%- if property.required()%}
                {%- if counter == schema.properties().length %}
                    {{ property.type() | toJavaType }} {{ propertyName }}
                {%- else %}
                    {{ property.type() | toJavaType }} {{ propertyName }},
                {%- endif %}
            {%- set counter = counter +1 %}
            {%- endif %}
        {%- endfor %}) {
        {%- for propertyName, property in schema.properties() %}
            {%- if property.required()%}
                this.{{ propertyName }}={{ propertyName }};
            {%- endif %}
        {%- endfor %}
        }
    }
    ```
    The `toJavaType` filter:
    ```js
    Nunjucks.addFilter('toJavaType', jsonSchemaType => {
    switch (jsonSchemaType.toLowerCase()) {
        case 'string':
        return 'String';
        case 'integer':
        return  'Integer'
        case 'number':
        return 'Double';
        case 'boolean':
        return 'boolean';
    }
    });
    ```
* Nodejs example where `$$schema$$.js` file looks like this:
    ```js
    export default class {{ schema.name() }} {
    {%- for propertyName, property in schema.properties() %}
        {%- if property.required()%}
    public {{ propertyName }}:{{ property.type() }};
        {%- else %}
    public {{ propertyName }}?:{{ property.type() }};
        {%- endif %}
    {%- endfor %}
    constructor(
        {%- set counter = 0 %}
        {%- for propertyName, property in schema.properties() %}
            {%- if property.required()%}
                {%- if counter == schema.properties().length %}
                    {{ propertyName }}:{{ property.type() }}
                {%- else %}
                    {{ propertyName }}:{{ property.type() }},
                {%- endif %}
            {%- set counter = counter +1 %}
            {%- endif %}
        {%- endfor %}
        ) {
        {%- for propertyName, property in schema.properties() %}
            {%- if property.required()%}
                this.{{ propertyName }}={{ propertyName }};
            {%- endif %}
        {%- endfor %}
    }
    }
    ```

### Displaying separate lists for different channels operations

* HTML example that renders two separate containers, one with `publish` and second with `subscribe` operations:
    ```html
    {% for channelName, channel in asyncapi.channels() %}
    <div class="responsive-container">
        {% if channel.hasPublish() %}
        {{ channelName }}
        {{ channel | dump }}
        {% endif %}
    </div>
    <div class="responsive-container">
        {% if channel.hasSubscribe() %}
        {{ channelName }}
        {{ channel | dump }}
        {% endif %}
    </div>
    {% endfor %}
    ```