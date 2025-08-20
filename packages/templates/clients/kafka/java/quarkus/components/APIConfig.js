import { Text } from "@asyncapi/generator-react-sdk";


export default function APIConfig({ protocol }) {
    if (!protocol) {
        throw new Error('Protocol is not defined.');
    }

    const protocolEnum = protocol.toLowerCase();
    const templateType = `${protocolEnum}-template`;
    const configProperties = {
        "wss": `compression:
                    type: boolean
                    default: true
                  subprotocols:
                    type: array
                    items:
                      type: string
                  maxConnections:
                    type: integer
                    default: 100`,
        "kafka": ` # Kafka specific
                  partitions:
                    type: integer
                    default: 3
                  replicationFactor:
                    type: integer
                    default: 1
                  retentionMs:
                    type: integer
                    default: 604800000 # 7 days`
    };
    const topicORPathProperties = {
        "wss": `path:
                  type: string
                  description: "Path to the API endpoint."`,
        "kafka": `topic:
                  type: string
                  description: "Kafka/MQTT topic name for the API."`

    } 

    return (
        <Text>
            {`
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: apiconfigs.asyncapi.com
spec:
  group: asyncapi.com
  scope: Namespaced
  names:
    plural: apiconfigs
    singular: apiconfig
    kind: APIConfig
  versions:
    - name: v1
      served: true
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              required:
                - protocol
                - templateType
              properties:
                protocol:
                  type: string
                  enum: ["${protocolEnum}"]
                  description: "Message protocol used by the API, e.g., kafka, mqtt, etc."
                ${topicORPathProperties[protocolEnum]}
                templateType:
                  type: string
                  enum: ["${templateType}"]
                config:
                  type: object
                  properties:
                    replicas:
                      type: integer
                      minimum: 1
                      default: 1
            status:
              type: object
              properties:
                deployed:
                  type: boolean
                phase:
                  type: string
                  enum: ["Pending", "Creating", "Running", "Failed", "Deleting"]
                  description: "Current lifecycle phase of the APIConfig."
                message:
                  type: string
                url:
                  type: string
                  description: "Service endpoint URL"
                lastReconciled:
                  type: string
                  format: date-time`}
        </Text>
    );

}

                                              

/**
 * path:
                  type: string
                  description: "Path to the API endpoint." # this is for websockets
                topic:
                  type: string
                  description: "Kafka/MQTT topic name for the API."
apiVersion: apiextensions.k8s.io/v1
            kind: CustomResourceDefinition
            metadata:
                name: apiconfigs..asyncapi.com
            spec:
                group: .asyncapi.com
                versions:
                    - name: v1
                      served: true
                      storage: true
                      schema:
                          openAPIV3Schema:
                              type: object
                              properties:
                                  spec:
                                      type: object
                                      required:
                                      -protocol
                                      -templateType
                                      properties:
                                          protocol:
                                              type: string
                                              enum: ["{protocol}"]
                                              description: "Message protocol used by the API, e.g., kafka, mqtt, etc."
                                          path:
                                              type: string
                                              description: "Path to the API endpoint."
                                          topic:
                                              type: string
                                              description: "Kafka/MQTT topic name for the API."
                                          templateType:
                                              type: string
                                              enum: ["{templateType}"]
                                          config:
                                              type: object
                                              properties:
                                                {configProperties[protocolEnum]}
                                                replicas:
                                                    type: integer
                                                    default: 1
                                                resources:
                                                    type: object
                                                    properties:
                                                    requests:
                                                        type: object
                                                        properties:
                                                        memory:
                                                            type: string
                                                            default: "128Mi"
                                                        cpu:
                                                            type: string
                                                            default: "100m"
                                                    limits:
                                                        type: object
                                                        properties:
                                                        memory:
                                                            type: string
                                                            default: "512Mi"
                                                        cpu:
                                                            type: string
                                                            default: "500m"
                              status:
                                type: object
                                properties:
                                deployed:
                                    type: boolean
                                phase:
                                    type: string
                                    enum: ["Pending", "Creating", "Running", "Failed", "Deleting"]
                                message:
                                    type: string
                                url:
                                    type: string
                                    description: "Service endpoint URL"
                                lastReconciled:
                                    type: string
                                    format: date-time
                                            
                scope: Namespaced
                names:
                    plural: apiconfigs
                    singular: apiconfig
                    kind: APIConfig
                    shortNames:
                    - apicfg
 */