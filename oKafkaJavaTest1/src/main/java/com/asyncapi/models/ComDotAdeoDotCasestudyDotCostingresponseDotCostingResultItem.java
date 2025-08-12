package com.asyncapi.models;

import java.util.Objects;
import java.util.Map;

public class ComDotAdeoDotCasestudyDotCostingresponseDotCostingResultItem implements AnonymousSchema_25 {
  private float calculationPrice;
  private AnonymousSchema_27 calculationCurrency;
  private ComDotAdeoDotCasestudyDotCostingresponseDotCostingResultDetailsItem[] calculationDetails;
  private Map<String, Object> additionalProperties;

  public float getCalculationPrice() { return this.calculationPrice; }
  public void setCalculationPrice(float calculationPrice) { this.calculationPrice = calculationPrice; }

  public AnonymousSchema_27 getCalculationCurrency() { return this.calculationCurrency; }
  public void setCalculationCurrency(AnonymousSchema_27 calculationCurrency) { this.calculationCurrency = calculationCurrency; }

  public ComDotAdeoDotCasestudyDotCostingresponseDotCostingResultDetailsItem[] getCalculationDetails() { return this.calculationDetails; }
  public void setCalculationDetails(ComDotAdeoDotCasestudyDotCostingresponseDotCostingResultDetailsItem[] calculationDetails) { this.calculationDetails = calculationDetails; }

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
    ComDotAdeoDotCasestudyDotCostingresponseDotCostingResultItem self = (ComDotAdeoDotCasestudyDotCostingresponseDotCostingResultItem) o;
      return 
        Objects.equals(this.calculationPrice, self.calculationPrice) &&
        Objects.equals(this.calculationCurrency, self.calculationCurrency) &&
        Objects.equals(this.calculationDetails, self.calculationDetails) &&
        Objects.equals(this.additionalProperties, self.additionalProperties);
  }

  @Override
  public int hashCode() {
    return Objects.hash((Object)calculationPrice, (Object)calculationCurrency, (Object)calculationDetails, (Object)additionalProperties);
  }

  @Override
  public String toString() {
    return "class ComDotAdeoDotCasestudyDotCostingresponseDotCostingResultItem {\n" +   
      "    calculationPrice: " + toIndentedString(calculationPrice) + "\n" +
      "    calculationCurrency: " + toIndentedString(calculationCurrency) + "\n" +
      "    calculationDetails: " + toIndentedString(calculationDetails) + "\n" +
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