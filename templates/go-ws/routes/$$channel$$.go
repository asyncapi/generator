package routes

import (
	"log"
  "net/http"

  "github.com/gorilla/websocket"
  "{{ asyncapi.info().title() | kebabCase }}/handlers"
)

func Serve{{channelName | camelCase | upperFirst}}(w http.ResponseWriter, r *http.Request) {
  var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
  }

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

  defer ws.Close()
  {%- if channel.hasPublish() %}

	for {
		_, message, err := ws.ReadMessage()
		if err != nil {
			break
		}

		handlers.{{ channel.publish().id() | upperFirst }}("{{ channelName }}", message)
  }
  {%- endif %}
}
