package main.java.com.asyncapi.crd;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ApiConfigSpec {
    @JsonProperty("protocol")
    private String protocol;
    
    @JsonProperty("path")
    private String path;
    
    @JsonProperty("topic")
    private String topic;
    
    @JsonProperty("templateType")
    private String templateType;
    
    // @JsonProperty("config")
    // private ApiConfig config;

    // Getters and setters...
    
    
    public String getProtocol() {
        return protocol;
    }

    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }
    public String getPath() {
        return path;
    }
    public void setPath(String path) {
        this.path = path;
    }
    public String getTopic() {
        return topic;
    }
    public void setTopic(String topic) {
        this.topic = topic; // only for kafak topic, this is where I'll template so websockets don't have this apiconfigspec variable
    }
    public String getTemplateType() {
        return templateType;
    }
    public void setTemplateType(String templateType) {
        this.templateType = templateType;
    }
    // public ApiConfig getConfig() {
    //     return config;
    // }
    // public void setConfig(ApiConfig config) {
    //     this.config = config;
    // }


    @Override
    public String toString() {
        return "ApiConfigSpec{" +
                "protocol='" + protocol + '\'' +
                ", path='" + path + '\'' +
                ", topic='" + topic + '\'' +
                ", templateType='" + templateType + '\'' +
                '}';
    }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ApiConfigSpec)) return false;

        ApiConfigSpec that = (ApiConfigSpec) o;

        if (!protocol.equals(that.protocol)) return false;
        if (!path.equals(that.path)) return false;
        if (!topic.equals(that.topic)) return false;
        return templateType.equals(that.templateType);
    }
    @Override
    public int hashCode() {
        int result = protocol.hashCode();
        result = 31 * result + path.hashCode();
        result = 31 * result + topic.hashCode();
        result = 31 * result + templateType.hashCode();
        return result;
    }

}