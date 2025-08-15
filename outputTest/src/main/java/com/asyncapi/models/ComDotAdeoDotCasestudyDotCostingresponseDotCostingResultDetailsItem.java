package com.asyncapi.models;

import java.util.Objects;
import java.util.Map;

public class ComDotAdeoDotCasestudyDotCostingresponseDotCostingResultDetailsItem {
  private String code;
  private String formula;
  private float value;
  private Map<String, Object> additionalProperties;

  public String getCode() { return this.code; }
  public void setCode(String code) { this.code = code; }

  public String getFormula() { return this.formula; }
  public void setFormula(String formula) { this.formula = formula; }

  public float getValue() { return this.value; }
  public void setValue(float value) { this.value = value; }

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
    ComDotAdeoDotCasestudyDotCostingresponseDotCostingResultDetailsItem self = (ComDotAdeoDotCasestudyDotCostingresponseDotCostingResultDetailsItem) o;
      return 
        Objects.equals(this.code, self.code) &&
        Objects.equals(this.formula, self.formula) &&
        Objects.equals(this.value, self.value) &&
        Objects.equals(this.additionalProperties, self.additionalProperties);
  }

  @Override
  public int hashCode() {
    return Objects.hash((Object)code, (Object)formula, (Object)value, (Object)additionalProperties);
  }

  @Override
  public String toString() {
    return "class ComDotAdeoDotCasestudyDotCostingresponseDotCostingResultDetailsItem {\n" +   
      "    code: " + toIndentedString(code) + "\n" +
      "    formula: " + toIndentedString(formula) + "\n" +
      "    value: " + toIndentedString(value) + "\n" +
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