@Websocket
public class LightMeasured {
  @Service
  private Integer id;
  @Service
  private Integer lumens;
  private java.time.OffsetDateTime sentAt;
  private Map<String, Object> additionalProperties;

  public Integer getId() { return this.id; }
  public void setId(Integer id) { this.id = id; }

  public Integer getLumens() { return this.lumens; }
  public void setLumens(Integer lumens) { this.lumens = lumens; }

  public java.time.OffsetDateTime getSentAt() { return this.sentAt; }
  public void setSentAt(java.time.OffsetDateTime sentAt) { this.sentAt = sentAt; }

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
                      Name event = (Nmae) o;
                      return Objects.equals(this.payload, event.payload);
                  }
}