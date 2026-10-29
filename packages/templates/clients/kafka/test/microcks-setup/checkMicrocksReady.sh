#!/bin/bash
# List the container names as defined in the Compose file
containers=("microcks-db" "microcks-kafka" "microcks" "microcks-async-minion")

# Determine engine (check which one is running the microcks containers)
if docker ps 2>/dev/null | grep -q "microcks"; then
  CONTAINER_CLI="docker"
elif podman ps 2>/dev/null | grep -q "microcks"; then
  CONTAINER_CLI="podman"
elif command -v docker >/dev/null 2>&1; then
  CONTAINER_CLI="docker"
else
  CONTAINER_CLI="podman"
fi

# Function to check if all containers are healthy
all_healthy() {
  for container in "${containers[@]}"; do
    status=$($CONTAINER_CLI inspect --format '{{.State.Health.Status}}' "$container" 2>/dev/null)
    if [[ "$status" != "healthy" ]]; then
      echo "Container $container is not healthy yet (current status: $status)"
      return 1
    fi
  done
  return 0
}

echo "Waiting for all services to become healthy using $CONTAINER_CLI..."
until all_healthy; do
  echo "One or more services are not healthy. Waiting 5 seconds before checking again..."
  sleep 5
done

echo "All services are healthy. Proceeding with the next steps..."
