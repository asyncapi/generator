package main.java.com.asyncapi.crd;

import io.fabric8.kubernetes.api.model.Namespaced;
import io.fabric8.kubernetes.client.CustomResource;
import io.fabric8.kubernetes.model.annotation.Group;
import io.fabric8.kubernetes.model.annotation.Version;

@Group("asyncapi.com")
@Version("v1")
public class ApiConfig extends CustomResource<ApiConfigSpec, ApiConfigStatus> implements Namespaced {
    private static final long serialVersionUID = 1L;

    private ApiConfigSpec spec;
    private ApiConfigStatus status;
    private Integer replicas = 1; // Default to 1 replica


    public ApiConfigSpec getSpec() {
        return spec;
    }
    public void setSpec(ApiConfigSpec spec) {
        this.spec = spec;
    }
    public ApiConfigStatus getStatus() {
        return status;
    }
    public void setStatus(ApiConfigStatus status) {
        this.status = status;
    }

    public Integer getReplicas() {
        return replicas;
    }

    public void setReplicas(Integer replicas) {
        this.replicas = replicas;
    }
}