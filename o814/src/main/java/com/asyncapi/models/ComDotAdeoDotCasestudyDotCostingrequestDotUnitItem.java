package com.asyncapi.models;

import java.util.Objects;
import java.util.Map;

public class ComDotAdeoDotCasestudyDotCostingrequestDotUnitItem {
  private float length;
  private float width;
  private float height;
  private float weightGross;
  private float weightNet;
  private Map<String, Object> additionalProperties;

  public float getLength() { return this.length; }
  public void setLength(float length) { this.length = length; }

  public float getWidth() { return this.width; }
  public void setWidth(float width) { this.width = width; }

  public float getHeight() { return this.height; }
  public void setHeight(float height) { this.height = height; }

  public float getWeightGross() { return this.weightGross; }
  public void setWeightGross(float weightGross) { this.weightGross = weightGross; }

  public float getWeightNet() { return this.weightNet; }
  public void setWeightNet(float weightNet) { this.weightNet = weightNet; }

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
    ComDotAdeoDotCasestudyDotCostingrequestDotUnitItem self = (ComDotAdeoDotCasestudyDotCostingrequestDotUnitItem) o;
      return 
        Objects.equals(this.length, self.length) &&
        Objects.equals(this.width, self.width) &&
        Objects.equals(this.height, self.height) &&
        Objects.equals(this.weightGross, self.weightGross) &&
        Objects.equals(this.weightNet, self.weightNet) &&
        Objects.equals(this.additionalProperties, self.additionalProperties);
  }

  @Override
  public int hashCode() {
    return Objects.hash((Object)length, (Object)width, (Object)height, (Object)weightGross, (Object)weightNet, (Object)additionalProperties);
  }

  @Override
  public String toString() {
    return "class ComDotAdeoDotCasestudyDotCostingrequestDotUnitItem {\n" +   
      "    length: " + toIndentedString(length) + "\n" +
      "    width: " + toIndentedString(width) + "\n" +
      "    height: " + toIndentedString(height) + "\n" +
      "    weightGross: " + toIndentedString(weightGross) + "\n" +
      "    weightNet: " + toIndentedString(weightNet) + "\n" +
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