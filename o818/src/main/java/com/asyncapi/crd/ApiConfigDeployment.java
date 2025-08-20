// ApiConfigDeployment.java
package main.java.com.asyncapi.crd;

import io.fabric8.kubernetes.api.model.*;
import io.fabric8.kubernetes.api.model.apps.*;
import io.javaoperatorsdk.operator.api.reconciler.Context;
import io.javaoperatorsdk.operator.processing.dependent.kubernetes.CRUDKubernetesDependentResource;
import java.util.Map;
import java.util.List;

public class ApiConfigDeployment extends CRUDKubernetesDependentResource<Deployment, ApiConfig> {

    public ApiConfigDeployment() {
        super(Deployment.class);
    }

    @Override
    protected Deployment desired(ApiConfig apiConfig, Context<ApiConfig> context) {
        String protocol = apiConfig.getSpec().getProtocol();
        String imageName = determineImage(protocol);
        
        return new DeploymentBuilder()
            .withNewMetadata()
                .withName(apiConfig.getMetadata().getName())
                .withNamespace(apiConfig.getMetadata().getNamespace())
                .withLabels(Map.of("app", apiConfig.getMetadata().getName()))
            .endMetadata()
            .withNewSpec()
                .withReplicas(apiConfig.getReplicas())
                .withNewSelector()
                    .withMatchLabels(Map.of("app", apiConfig.getMetadata().getName()))
                .endSelector()
                .withNewTemplate()
                    .withNewMetadata()
                        .withLabels(Map.of("app", apiConfig.getMetadata().getName()))
                    .endMetadata()
                    .withNewSpec()
                        .withHostNetwork(true)  // This allows the pod to access host network
                        .addNewContainer()
                            .withName(apiConfig.getMetadata().getName())
                            .withImage(imageName)
                            .withPorts(List.of(
                                new ContainerPortBuilder()
                                    .withContainerPort(8080)
                                    .withProtocol("TCP")
                                    .build()
                            ))
                            .withEnv(List.of(
                                new EnvVarBuilder()
                                    .withName("KAFKA_BOOTSTRAP_SERVERS")
                                    .withValue("localhost:9092")
                                    .build()
                            ))
                        .endContainer()
                    .endSpec()
                .endTemplate()
            .endSpec()
            .build();
        
    }
    
    private String determineImage(String protocol) {
        return "ssala034/quarkus-kafka-operator:latest"; // hardcoded for testing purpose
        // return switch (protocol) {
        //     case "websocket" -> "websocket-service:latest"; 
        //     case "kafka-secure" -> "kafka-service:latest";
        //     default -> throw new IllegalArgumentException("Unsupported protocol: " + protocol);
        // };
    }
}