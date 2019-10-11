package handlers

import (
	"log"
)
{% if channel.hasPublish() %}
func {{ channel.publish().id() | upperFirst }}(path string, message []byte) {
  log.Println(path, "->", string(message))
}
{% endif %}
{%- if channel.hasSubscribe() %}
func {{ channel.subscribe().id() | upperFirst }}(path string, message []byte) {
  log.Println(path, "->", string(message))
}
{% endif %}
