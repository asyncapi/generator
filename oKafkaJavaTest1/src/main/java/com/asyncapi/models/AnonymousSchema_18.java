package com.asyncapi.models;

public enum AnonymousSchema_18 {
  FT20((String)"FT20"), FT40((String)"FT40"), FT40_HC((String)"FT40HC"), TRUCK((String)"TRUCK");

  private final String value;

  AnonymousSchema_18(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }

  public static AnonymousSchema_18 fromValue(String value) {
    for (AnonymousSchema_18 e : AnonymousSchema_18.values()) {
      if (e.value.equals(value)) {
        return e;
      }
    }
    throw new IllegalArgumentException("Unexpected value '" + value + "'");
  }

  @Override
  public String toString() {
    return String.valueOf(value);
  }
}