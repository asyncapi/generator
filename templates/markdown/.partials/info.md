{% if asyncapi.info.termsOfService %}
<a name="termsOfService"></a>
## Terms of service
[{{asyncapi.info.termsOfService}}]({{asyncapi.info.termsOfService}})
{% endif %}

{% if asyncapi.servers %}
<a name="servers"></a>
## Servers

<table>
  <thead>
    <tr>
      <th>URL</th>
      <th>Protocol</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
  {% for server in asyncapi.servers -%}
    <tr>
      <td>{{server.url}}</td>
      <td>{{server.protocol}}{% if server.protocolVersion %}{{server.protocolVersion}}{% endif %}</td>
      <td>{{server.description | safe}}</td>
    </tr>
    {% if server.variables -%}
    <tr>
      <td colspan="3">
        <details>
          <summary>URL Variables</summary>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Default value</th>
                <th>Possible values</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {% for varName, var in server.variables -%}
              <tr>
                <td>{{varName}}</td>
                <td>
                  {%- if var.default %}
                    {{var.default}}
                  {% else %}
                    <em>None</em>
                  {% endif -%}
                </td>
                <td>
                  {%- if var.enum %}
                  <ul>
                    {%- for value in var.enum -%}
                    <li>{{value}}</li>
                    {%- endfor -%}
                  </ul>
                  {% else %}
                    Any
                  {% endif -%}
                </td>
                <td>{{ var.description | safe }}</td>
              </tr>
              {% endfor -%}
            </tbody>
          </table>
        </details>
      </td>
    </tr>
    {% endif -%}
    {% if server._security -%}
    <tr>
      <td colspan="3">
        <details>
          <summary>Security Requirements</summary>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>In</th>
                <th>Name</th>
                <th>Scheme</th>
                <th>Format</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
            {%- for security in server._security %}
              <tr>
                <td>{{security.type}}</td>
                <td>{{security.in}}</td>
                <td>{{security.name}}</td>
                <td>{{security.scheme}}</td>
                <td>{{security.bearerFormat}}</td>
                <td>{{security.descriptionAsHTML | safe }}</td>
              </tr>
            {%- endfor -%}
            </tbody>
          </table>
        </details>
      </td>
    </tr>
    {% endif %}
  {%- endfor -%}
  </tbody>
</table>
{% endif %}
