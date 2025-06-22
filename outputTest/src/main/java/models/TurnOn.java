@Websocket
public class TurnOn {
  @Service
  private Integer id;
  private java.time.OffsetDateTime sentAt;
  private Map<String, Object> additionalProperties;

  public Integer getId() { return this.id; }
  public void setId(Integer id) { this.id = id; }

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