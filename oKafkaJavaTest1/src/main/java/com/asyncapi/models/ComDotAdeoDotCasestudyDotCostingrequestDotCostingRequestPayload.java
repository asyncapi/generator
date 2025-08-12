package com.asyncapi.models;

import java.util.Objects;

public class ComDotAdeoDotCasestudyDotCostingrequestDotCostingRequestPayload {
  private String productId;
  private Object shortProductDescription;
  private String supplierCode;
  private Float supplierPrice;
  private ComDotAdeoDotCasestudyDotCostingrequestDotUnitItem unit;
  private ComDotAdeoDotCasestudyDotCostingrequestDotCostingRequestBuItem[] busInputs;

  public String getProductId() { return this.productId; }
  public void setProductId(String productId) { this.productId = productId; }

  public Object getShortProductDescription() { return this.shortProductDescription; }
  public void setShortProductDescription(Object shortProductDescription) { this.shortProductDescription = shortProductDescription; }

  public String getSupplierCode() { return this.supplierCode; }
  public void setSupplierCode(String supplierCode) { this.supplierCode = supplierCode; }

  public Float getSupplierPrice() { return this.supplierPrice; }
  public void setSupplierPrice(Float supplierPrice) { this.supplierPrice = supplierPrice; }

  public ComDotAdeoDotCasestudyDotCostingrequestDotUnitItem getUnit() { return this.unit; }
  public void setUnit(ComDotAdeoDotCasestudyDotCostingrequestDotUnitItem unit) { this.unit = unit; }

  public ComDotAdeoDotCasestudyDotCostingrequestDotCostingRequestBuItem[] getBusInputs() { return this.busInputs; }
  public void setBusInputs(ComDotAdeoDotCasestudyDotCostingrequestDotCostingRequestBuItem[] busInputs) { this.busInputs = busInputs; }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ComDotAdeoDotCasestudyDotCostingrequestDotCostingRequestPayload self = (ComDotAdeoDotCasestudyDotCostingrequestDotCostingRequestPayload) o;
      return 
        Objects.equals(this.productId, self.productId) &&
        Objects.equals(this.shortProductDescription, self.shortProductDescription) &&
        Objects.equals(this.supplierCode, self.supplierCode) &&
        Objects.equals(this.supplierPrice, self.supplierPrice) &&
        Objects.equals(this.unit, self.unit) &&
        Objects.equals(this.busInputs, self.busInputs);
  }

  @Override
  public int hashCode() {
    return Objects.hash((Object)productId, (Object)shortProductDescription, (Object)supplierCode, (Object)supplierPrice, (Object)unit, (Object)busInputs);
  }

  @Override
  public String toString() {
    return "class ComDotAdeoDotCasestudyDotCostingrequestDotCostingRequestPayload {\n" +   
      "    productId: " + toIndentedString(productId) + "\n" +
      "    shortProductDescription: " + toIndentedString(shortProductDescription) + "\n" +
      "    supplierCode: " + toIndentedString(supplierCode) + "\n" +
      "    supplierPrice: " + toIndentedString(supplierPrice) + "\n" +
      "    unit: " + toIndentedString(unit) + "\n" +
      "    busInputs: " + toIndentedString(busInputs) + "\n" +
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