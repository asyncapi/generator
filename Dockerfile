ARG NODE_VERSION=18
FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /app

# ----------------------------------------
# Stage 1: Prepare package.json files
FROM base AS installer

# COPY the whole project to the container
# The following line raises a security hotspot in SonarQube, but it is necessary to copy the whole project to the container
# We can ignore this and deem it as false positive, because this is mainly for local development and testing
# We have manually marked this as safe in SonarQube UI
COPY . .

# Run turbo prune to prune the project down to just package.json files of the project
# This creates a new directory called /out with the following structure:
# /out
# ├── json -> package.json files of the project
# ├── full -> full source code of the project
# └── package-lock.json -> package-lock.json of the project
# We have to specify the package names. Some packages are included as dependencies in others, they will be automatically included
RUN npx turbo@1.13.3 prune @asyncapi/generator @asyncapi/generator-react-sdk @asyncapi/generator-components --docker --out-dir /out

# ----------------------------------------
# Stage 2: Install dependencies
FROM base AS final

# Copy package.json files extracted by turbo prune
COPY --from=installer /out/json/ .
COPY --from=installer /out/package-lock.json ./package-lock.json

# Install dependencies only with package.json files to make use of cache
RUN npm ci --ignore-scripts

# Copy the rest of the source code
COPY --from=installer /out/full/ .

# Change ownership of the /app directory to the node user
RUN chown -R node:node /app

# Run the application as a non-root user
USER node

CMD ["npm", "test"]
