
export default class {{ message.name() }} {
    {%- for propertyName, property in message.payload().properties() %}
    public {{ propertyName }}?:{{ property.type() }};
    {%- endfor %}
    constructor();
    constructor(
        {% set counter = 0 %}
        {%- for propertyName, property in message.payload().properties() %}
        {%- if property.required()%}
        {{ propertyName }}?:{{ property.type() }}
        {%- endif %}
        {%- endfor %}
        ) {
        {%- for propertyName, property in message.payload().properties() %}
        {%- if property.required()%}
        this.{{ propertyName }}={{ propertyName }};
        {%- endif %}
        {%- endfor %}
    }

    copyInto(jsonString: any){
        {%- for propertyName, property in message.payload().properties() %}
        this.{{ propertyName }}=jsonString.{{ propertyName }};
        {%- endfor %}
    }
}