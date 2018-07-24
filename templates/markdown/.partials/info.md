{{#if asyncapi.info.termsOfService}}
<a name="termsOfService"></a>
## Terms of service
[{{asyncapi.info.termsOfService}}]({{asyncapi.info.termsOfService}})
{{/if}}

{{#if asyncapi.servers}}
<a name="servers"></a>
## Connection details

<table class="table">
  <thead class="table__head">
    <tr class="table__head__row">
      <th class="table__head__cell">URL</th>
      <th class="table__head__cell">Scheme</th>
      <th class="table__head__cell">Description</th>
    </tr>
  </thead>
  <tbody class="table__body">
  {{#each asyncapi.servers as |server|}}
    <tr class="table__body__row">
      <td class="table__body__cell">{{#if server.variables}}<div class="table__expand" data-index={{@index}}></div>{{/if}}{{server.url}}</td>
      <td class="table__body__cell">{{server.scheme}}</td>
      <td class="table__body__cell">{{{server.description}}}</td>
    </tr>

    {{#if server.variables}}
    <tr class="table__body__row--with-nested" data-nested-index={{@index}}>
      <td colspan="3">
        <details>
          <summary>Show more</summary>
          <table class="table table--nested">
            <thead class="table__head table--nested__head">
              <tr>
                <td class="table--nested__header" colspan="4">URL Variables</td>
              </tr>
              <tr class="table__head__row table--nested__head__row">
                <th class="table__head__cell table--nested__head__cell">Name</th>
                <th class="table__head__cell table--nested__head__cell">Default value</th>
                <th class="table__head__cell table--nested__head__cell">Possible values</th>
                <th class="table__head__cell table--nested__head__cell">Description</th>
              </tr>
            </thead>
            <tbody class="table__body table--nested__body">
              {{#each server.variables as |var|}}
              <tr class="table__body__row table--nested__body__row">
                <td class="table__body__cell table--nested__body__cell">{{@key}}</td>
                <td class="table__body__cell table--nested__body__cell">
                  {{#if var.default}}
                    {{var.default}}
                  {{else}}
                    <em>None</em>
                  {{/if}}
                </td>
                <td class="table__body__cell table--nested__body__cell">
                  {{#if var.enum}}
                  <ul class="info__server__enum-list">
                    {{#each var.enum as |value|}}
                    <li>{{value}}</li>
                    {{/each}}
                  </ul>
                  {{else}}
                    Any
                  {{/if}}
                </td>
                <td class="table__body__cell table--nested__body__cell">{{{var.description}}}</td>
              </tr>
              {{/each}}
            </tbody>
          </table>
        </details>
      </td>
    </tr>
    {{/if}}
  {{/each}}

  </tbody>
</table>
{{/if}}
