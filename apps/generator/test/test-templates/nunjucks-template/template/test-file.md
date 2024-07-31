This is a markdown file for my application.
App name is: **{{ asyncapi.info().title() }}**
Version {{params.version}} running on {{params.mode}} mode

HTML description: **{{ asyncapi.info().description() | markdown2html }}**