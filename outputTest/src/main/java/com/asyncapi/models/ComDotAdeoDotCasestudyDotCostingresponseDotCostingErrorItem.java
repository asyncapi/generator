package com.asyncapi.models;

import java.util.Objects;
import java.util.Map;

public class ComDotAdeoDotCasestudyDotCostingresponseDotCostingErrorItem {
  private AnonymousSchema_35 type;
  private String code;
  private String step;
  private String description;
  private Map<String, Object> additionalProperties;

  public AnonymousSchema_35 getType() { return this.type; }
  public void setType(AnonymousSchema_35 type) { this.type = type; }

  public String getCode() { return this.code; }
  public void setCode(String code) { this.code = code; }

  public String getStep() { return this.step; }
  public void setStep(String step) { this.step = step; }

  public String getDescription() { return this.description; }
  public void setDescription(String description) { this.description = description; }

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
    ComDotAdeoDotCasestudyDotCostingresponseDotCostingErrorItem self = (ComDotAdeoDotCasestudyDotCostingresponseDotCostingErrorItem) o;
      return 
        Objects.equals(this.type, self.type) &&
        Objects.equals(this.code, self.code) &&
        Objects.equals(this.step, self.step) &&
        Objects.equals(this.description, self.description) &&
        Objects.equals(this.additionalProperties, self.additionalProperties);
  }

  @Override
  public int hashCode() {
    return Objects.hash((Object)type, (Object)code, (Object)step, (Object)description, (Object)additionalProperties);
  }

  @Override
  public String toString() {
    return "class ComDotAdeoDotCasestudyDotCostingresponseDotCostingErrorItem {\n" +   
      "    type: " + toIndentedString(type) + "\n" +
      "    code: " + toIndentedString(code) + "\n" +
      "    step: " + toIndentedString(step) + "\n" +
      "    description: " + toIndentedString(description) + "\n" +
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