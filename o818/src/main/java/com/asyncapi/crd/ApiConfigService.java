package main.java.com.asyncapi.crd;

import io.fabric8.kubernetes.api.model.Service;
import io.fabric8.kubernetes.api.model.ServiceBuilder;

import java.util.Map;

import io.fabric8.kubernetes.api.model.IntOrString;
import io.javaoperatorsdk.operator.api.reconciler.Context;
import io.javaoperatorsdk.operator.processing.dependent.kubernetes.CRUDKubernetesDependentResource;
/**
 * ApiConfigService is responsible for managing the Kubernetes Service resource
 * associated with an ApiConfig custom resource.
 */

public class ApiConfigService extends CRUDKubernetesDependentResource<Service, ApiConfig> {

    public ApiConfigService() {
        super(Service.class);
    }

    @Override
    protected Service desired(ApiConfig apiConfig, Context<ApiConfig> context) {
        
        return new ServiceBuilder()
            .withNewMetadata()
                .withName(apiConfig.getMetadata().getName() + "-service")
                .withNamespace(apiConfig.getMetadata().getNamespace()) // make sure I have the right namespace
            .endMetadata()
            .withNewSpec()
                .withSelector(Map.of("app", apiConfig.getMetadata().getName()))
                .addNewPort()
                    .withPort(8080)
                    .withTargetPort(new IntOrString(8080))
                    .withProtocol("TCP")
                .endPort()
                .withType("ClusterIP") // what is this
            .endSpec()
            .build();
    }
}