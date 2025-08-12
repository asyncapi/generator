package com.asyncapi.models;

public enum AnonymousSchema_27 {
  USD((String)"USD"), EUR((String)"EUR"), CNY((String)"CNY");

  private final String value;

  AnonymousSchema_27(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }

  public static AnonymousSchema_27 fromValue(String value) {
    for (AnonymousSchema_27 e : AnonymousSchema_27.values()) {
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