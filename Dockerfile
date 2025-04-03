FROM node:18-alpine AS base

WORKDIR /app

# ----------------------------------------
# Stage 1: Prepare package.json files
FROM base AS installer

# Install turbo
RUN npm install -g turbo@1.13.3

# COPY the whole project to the container
COPY . .

# Run turbo prune to prune the project down to just package.json files of the project
# This creates a new directory called /out with the following structure:
# /out
# ├── json -> package.json files of the project
# ├── full -> full source code of the project
# └── package-lock.json -> package-lock.json of the project
# We have to specify the package names. Some packages are included as dependencies in others, they will be automatically included
RUN turbo prune @asyncapi/generator @asyncapi/template-js-websocket-client @asyncapi/generator-components --docker --out-dir /out

# ----------------------------------------
# Stage 2: Install dependencies
FROM base AS final

# Copy package.json files extracted by turbo prune
COPY --from=installer /out/json/ .
COPY --from=installer /out/package-lock.json ./package-lock.json

# Install dependencies only with package.json files to make use of cache
RUN npm ci

# Copy the rest of the source code
COPY --from=installer /out/full/ .

CMD ["npm", "test"]
