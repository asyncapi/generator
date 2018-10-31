package com.asyncapi.streetlights.domain;

public class LightMeasured {

    private Integer lumens;

    private String sentAt;

    public Integer getLumens() {
        return lumens;
    }

    public void setLumens(Integer lumens) {
        this.lumens = lumens;
    }

    public String getSentAt() {
        return sentAt;
    }

    public void setSentAt(String sentAt) {
        this.sentAt = sentAt;
    }

    @Override
    public String toString() {
        return "LightMeasured{" +
                "lumens=" + lumens +
                ", sentAt='" + sentAt + '\'' +
                '}';
    }
}
