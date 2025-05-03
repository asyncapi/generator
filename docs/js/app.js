
    const schema = {
  "asyncapi": "3.0.0",
  "info": {
    "title": "Temperature Service",
    "version": "1.0.0",
    "description": "Service that emits temperature changes from a bedroom sensor."
  },
  "servers": {
    "production": {
      "host": "broker.example.com",
      "protocol": "mqtt"
    }
  },
  "channels": {
    "temperatureChanged": {
      "address": "temperature/changed",
      "messages": {
        "temperatureChange": {
          "description": "Message sent when the temperature in the bedroom changes.",
          "payload": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "value": {
                "type": "number",
                "x-parser-schema-id": "<anonymous-schema-1>"
              },
              "unit": {
                "type": "string",
                "x-parser-schema-id": "<anonymous-schema-2>"
              }
            },
            "x-parser-schema-id": "Temperature"
          },
          "x-parser-unique-object-id": "temperatureChange",
          "x-parser-message-name": "temperatureChange"
        }
      },
      "x-parser-unique-object-id": "temperatureChanged"
    }
  },
  "operations": {
    "sendTemperatureChanged": {
      "action": "send",
      "summary": "Temperature changes are pushed to the broker",
      "channel": "$ref:$.channels.temperatureChanged",
      "x-parser-unique-object-id": "sendTemperatureChanged"
    }
  },
  "components": {
    "schemas": {
      "Temperature": "$ref:$.channels.temperatureChanged.messages.temperatureChange.payload"
    }
  },
  "x-parser-spec-parsed": true,
  "x-parser-api-version": 3,
  "x-parser-spec-stringified": true
};
    const config = {"show":{"sidebar":true},"sidebar":{"showOperations":"byDefault"}};
    const appRoot = document.getElementById('root');
    AsyncApiStandalone.render(
        { schema, config, }, appRoot
    );
  