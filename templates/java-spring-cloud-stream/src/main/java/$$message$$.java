{% include '.partials/java-package' -%}
import java.util.HashMap;
{%- set className = messageName | upperFirst %}
{%- set lowerMessageName = messageName | lowerFirst %}

public class {{ className }} { 

{% if message.json().headers.properties %}
	// Headers with their getters and setters.
	private HashMap<String, Object> headers = new HashMap<>();
{% for name, prop in message.json().headers.properties -%}
{%- set type = [name, prop] | fixType %}
	private {{ type }} {{ name }};
{% endfor %}

{%- for name, prop in message.json().headers.properties -%}
{%- set type = [name, prop] | fixType %}
	public {{ type }} get{{- name | upperFirst }}() {
		return {{ name }};
	}

	public {{ className }} set{{- name | upperFirst }}( {{ type }} {{ name }} ) {
		this.{{-name }} = {{ name }};
		headers.put("{{ name }}", {{ name }});
		return this;
	}

{% endfor %}
{% endif %}

	// Payload
{%- set type = message.json().payload.title | upperFirst %}
{% set name = message.json().payload.title | lowerFirst %}

	private {{ type }} {{ name }};

	public {{ type }} getPayload() {
		return {{ name }};
	}

	public {{ className }} setPayload({{ type }} {{ name }}) {
		this.{{- name }} = {{ name }};
		return this;
	}

	// Listers

	public interface SubscribeListener {
		public void onReceive({{ className }} {{ lowerMessageName }});
		public void handleException(Exception exception);
	}
}
