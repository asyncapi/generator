{{#if asyncapi._security}}
<a name="security"></a>
## Security

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
  {{#each asyncapi._security as |security|}}
    <tr>
      <td>{{security.type}}</td>
      <td>{{security.in}}</td>
      <td>{{security.name}}</td>
      <td>{{security.scheme}}</td>
      <td>{{security.bearerFormat}}</td>
      <td>{{{security.descriptionAsHTML}}}</td>
    </tr>
  {{/each}}
  </tbody>
</table>
{{/if}}
