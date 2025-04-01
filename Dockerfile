# Stage 1: Prepare package.json files
FROM node:18-alpine AS base

WORKDIR /app

# Install turbo
RUN npm install -g turbo@1.13.3

# Mount the project temporarily to use turbo prune to get all package.json files of the project
# We have to specify the package names. Some packages are included as dependencies in others, they will be automatically included
RUN --mount=type=bind,source=.,target=. turbo prune @asyncapi/generator @asyncapi/template-js-websocket-client @asyncapi/generator-components --docker --out-dir /out


# ----------------------------------------
# Stage 2: Install dependencies
FROM base AS final

# Copy package.json files extracted by turbo prune
COPY --from=base /out/json/ .
COPY --from=base /out/package-lock.json ./package-lock.json

# Install dependencies
RUN npm ci

# Copy the rest of the source code
COPY --from=base /out/full/ .

CMD ["npm", "test"]
