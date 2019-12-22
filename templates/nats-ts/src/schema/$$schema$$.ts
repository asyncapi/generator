
export default class {{ schema.name() }} {
  {%- for propertyName, property in schema.properties() %}
  public {{ propertyName }}?:{{ property.type() }};
  {%- endfor %}
  constructor();
  constructor(
      {% set counter = 0 %}
      {%- for propertyName, property in schema.properties() %}
      {%- if property.required()%}
      {%- if counter == schema.properties().length %}
      {{ propertyName }}?:{{ property.type() }}
      {%- else %}
      {{ propertyName }}?:{{ property.type() }},
      {%- endif %}
      {%- endif %}
      {%- endfor %}
      ) {
      {%- for propertyName, property in schema.properties() %}
      {%- if property.required()%}
      this.{{ propertyName }}={{ propertyName }};
      {%- endif %}
      {%- endfor %}
  }

  copyInto(jsonString: any){
      {%- for propertyName, property in schema.properties() %}
      this.{{ propertyName }}=jsonString.{{ propertyName }};
      {%- endfor %}
  }
}
