ARG NODE_VERSION=18
FROM node:${NODE_VERSION}

# Copy the entire project to the container
COPY . /app

# Run the test script
CMD ["bash", "/app/apps/generator/test/test-project/test.sh", "test-project"]
