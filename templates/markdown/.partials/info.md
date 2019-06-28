{{#if asyncapi.info.termsOfService}}
<a name="termsOfService"></a>
## Terms of service
[{{asyncapi.info.termsOfService}}]({{asyncapi.info.termsOfService}})
{{/if}}

{{#if asyncapi.servers}}
<a name="servers"></a>
## Connection details

<table>
  <thead>
    <tr>
      <th>URL</th>
      <th>Scheme</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
  {{#each asyncapi.servers as |server|}}
    <tr>
      <td>{{server.url}}</td>
      <td>{{server.scheme}}</td>
      <td>{{{server.description}}}</td>
    </tr>
    {{#if server.variables}}
    <tr>
      <td colspan="3">
        <table>
          <thead>
            <tr>
              <td colspan="4">URL Variables</td>
            </tr>
            <tr>
              <th>Name</th>
              <th>Default value</th>
              <th>Possible values</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {{#each server.variables as |var|}}
            <tr>
              <td>{{@key}}</td>
              <td>
                {{#if var.default}}
                  {{var.default}}
                {{else}}
                  <em>None</em>
                {{/if}}
              </td>
              <td>
                {{#if var.enum}}
                <ul>
                  {{#each var.enum as |value|}}
                  <li>{{value}}</li>
                  {{/each}}
                </ul>
                {{else}}
                  Any
                {{/if}}
              </td>
              <td>{{{var.description}}}</td>
            </tr>
            {{/each}}
          </tbody>
        </table>
      </td>
    </tr>
    {{/if}}
  {{/each}}

  </tbody>
</table>
{{/if}}
