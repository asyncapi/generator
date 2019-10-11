{%- set server = asyncapi.server(params.server) -%}
package main

import (
	"log"
  "net/http"

  "{{ asyncapi.info().title() | kebabCase }}/routes"
)

func renderIndex(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.Error(w, "Page not found", http.StatusNotFound)
		return
	}
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	http.ServeFile(w, r, "index.html")
}

func main() {
	http.HandleFunc("/", renderIndex)
  {% for channelName, channel in asyncapi.channels() -%}
  http.HandleFunc("{{ channelName | pathResolve }}", routes.Serve{{channelName | camelCase | upperFirst}})
  {%- endfor %}

	log.Fatal(http.ListenAndServe(":{{ server.url() | port }}", nil))
}
