#!/bin/bash
# List the container names as defined in your Compose file
containers=("microcks-db" "microcks-kafka" "microcks" "microcks-async-minion")

# Function to check if all containers are healthy
all_healthy() {
  for container in "${containers[@]}"; do
    # Use podman inspect to retrieve the health status
    status=$(podman inspect --format '{{.State.Health.Status}}' "$container" 2>/dev/null)
    if [[ "$status" != "healthy" ]]; then
      echo "Container $container is not healthy yet (current status: $status)"
      return 1
    fi
  done
  return 0
}

echo "Waiting for all services to become healthy..."
# Loop until all containers report healthy
until all_healthy; do
  echo "One or more services are not healthy. Waiting 5 seconds before checking again..."
  sleep 5
done

echo "All services are healthy. Proceeding with the next steps..."
