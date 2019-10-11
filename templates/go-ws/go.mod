module {{ asyncapi.info().title() | kebabCase }}

go 1.12

require github.com/gorilla/websocket v1.4.1
