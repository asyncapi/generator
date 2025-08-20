package main.java.com.asyncapi.crd;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ApiConfigStatus {
    @JsonProperty("deployed")
    private Boolean deployed = false;
    
    @JsonProperty("phase")
    private String phase = "Pending";
    
    @JsonProperty("message")
    private String message;
    
    @JsonProperty("url")
    private String url;
    
    // Getters and setters...

    public Boolean getDeployed() {
        return deployed;
    }
    public void setDeployed(Boolean deployed) {
        this.deployed = deployed;
    }
    public String getPhase() {
        return phase;
    }
    public void setPhase(String phase) {
        this.phase = phase;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public String getUrl() {
        return url;
    }
    public void setUrl(String url) {
        this.url = url;
    }
    @Override
    public String toString() {
        return "ApiConfigStatus{" +
                "deployed=" + deployed +
                ", phase='" + phase + '\'' +
                ", message='" + message + '\'' +
                ", url='" + url + '\'' +
                '}';
    }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ApiConfigStatus)) return false;

        ApiConfigStatus that = (ApiConfigStatus) o;

        if (!deployed.equals(that.deployed)) return false;
        if (!phase.equals(that.phase)) return false;
        if (!message.equals(that.message)) return false;
        return url.equals(that.url);
    }
    @Override
    public int hashCode() {
        int result = deployed.hashCode();
        result = 31 * result + phase.hashCode();
        result = 31 * result + message.hashCode();
        result = 31 * result + url.hashCode();
        return result;
    }

    
}