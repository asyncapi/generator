package com.asyncapi.models;

import java.util.Objects;
import java.util.Map;

public class ComDotAdeoDotCasestudyDotCostingrequestDotCostingRequestBuItem {
  private String clientCode;
  private Object containerType;
  private Map<String, Object> additionalProperties;

  public String getClientCode() { return this.clientCode; }
  public void setClientCode(String clientCode) { this.clientCode = clientCode; }

  public Object getContainerType() { return this.containerType; }
  public void setContainerType(Object containerType) { this.containerType = containerType; }

  public Map<String, Object> getAdditionalProperties() { return this.additionalProperties; }
  public void setAdditionalProperties(Map<String, Object> additionalProperties) { this.additionalProperties = additionalProperties; }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ComDotAdeoDotCasestudyDotCostingrequestDotCostingRequestBuItem self = (ComDotAdeoDotCasestudyDotCostingrequestDotCostingRequestBuItem) o;
      return 
        Objects.equals(this.clientCode, self.clientCode) &&
        Objects.equals(this.containerType, self.containerType) &&
        Objects.equals(this.additionalProperties, self.additionalProperties);
  }

  @Override
  public int hashCode() {
    return Objects.hash((Object)clientCode, (Object)containerType, (Object)additionalProperties);
  }

  @Override
  public String toString() {
    return "class ComDotAdeoDotCasestudyDotCostingrequestDotCostingRequestBuItem {\n" +   
      "    clientCode: " + toIndentedString(clientCode) + "\n" +
      "    containerType: " + toIndentedString(containerType) + "\n" +
      "    additionalProperties: " + toIndentedString(additionalProperties) + "\n" +
    "}";
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }
}