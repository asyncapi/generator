// ApiConfigReconciler.java
package main.java.com.asyncapi.crd;

import io.fabric8.kubernetes.api.model.*;
import io.fabric8.kubernetes.api.model.apps.Deployment;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.javaoperatorsdk.operator.api.reconciler.*;
import io.javaoperatorsdk.operator.api.reconciler.dependent.Dependent;

@ControllerConfiguration(dependents = {
    @Dependent(type = ApiConfigDeployment.class),
    @Dependent(type = ApiConfigService.class)
})
public class ApiConfigReconciler implements Reconciler<ApiConfig> {

    private final KubernetesClient client;

    public ApiConfigReconciler(KubernetesClient client) {
        this.client = client;
    }

    @Override
    public UpdateControl<ApiConfig> reconcile(ApiConfig apiConfig, io.javaoperatorsdk.operator.api.reconciler.Context<ApiConfig> context) {
        String protocol = apiConfig.getSpec().getProtocol();
        String namespace = apiConfig.getMetadata().getNamespace();
        
        try {
            // Update status
            apiConfig.getStatus().setPhase("Creating");
            apiConfig.getStatus().setMessage("Deploying " + protocol + " service");
            
            // The dependent resources will handle actual deployment
            
            // Update final status
            apiConfig.getStatus().setDeployed(true);
            apiConfig.getStatus().setPhase("Running");
            apiConfig.getStatus().setUrl(generateServiceUrl(apiConfig));
            
            return UpdateControl.updateStatus(apiConfig);
            
        } catch (Exception e) {
            apiConfig.getStatus().setPhase("Failed");
            apiConfig.getStatus().setMessage("Reconciliation failed: " + e.getMessage());
            return UpdateControl.updateStatus(apiConfig);
        }
    }

    private String generateServiceUrl(ApiConfig apiConfig) {
        return String.format("http://%s-service.%s.svc.cluster.local:8080",  // what is this wel for ???
            apiConfig.getMetadata().getName(),
            apiConfig.getMetadata().getNamespace());
    }
}