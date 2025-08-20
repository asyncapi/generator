package com.asyncapi.models;

import java.util.Objects;

public class ComDotAdeoDotCasestudyDotCostingresponseDotCostingResponsePayload {
  private AnonymousSchema_25 costingResult;
  private Object costingErrors;

  public AnonymousSchema_25 getCostingResult() { return this.costingResult; }
  public void setCostingResult(AnonymousSchema_25 costingResult) { this.costingResult = costingResult; }

  public Object getCostingErrors() { return this.costingErrors; }
  public void setCostingErrors(Object costingErrors) { this.costingErrors = costingErrors; }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ComDotAdeoDotCasestudyDotCostingresponseDotCostingResponsePayload self = (ComDotAdeoDotCasestudyDotCostingresponseDotCostingResponsePayload) o;
      return 
        Objects.equals(this.costingResult, self.costingResult) &&
        Objects.equals(this.costingErrors, self.costingErrors);
  }

  @Override
  public int hashCode() {
    return Objects.hash((Object)costingResult, (Object)costingErrors);
  }

  @Override
  public String toString() {
    return "class ComDotAdeoDotCasestudyDotCostingresponseDotCostingResponsePayload {\n" +   
      "    costingResult: " + toIndentedString(costingResult) + "\n" +
      "    costingErrors: " + toIndentedString(costingErrors) + "\n" +
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