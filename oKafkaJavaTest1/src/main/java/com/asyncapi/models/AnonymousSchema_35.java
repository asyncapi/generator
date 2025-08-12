package com.asyncapi.models;

public enum AnonymousSchema_35 {
  TECHNICAL((String)"TECHNICAL"), FUNCTIONAL((String)"FUNCTIONAL");

  private final String value;

  AnonymousSchema_35(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }

  public static AnonymousSchema_35 fromValue(String value) {
    for (AnonymousSchema_35 e : AnonymousSchema_35.values()) {
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