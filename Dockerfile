FROM node:12-alpine

WORKDIR /app

# Since 0.30.0 release Git is supported and required as a dependency
RUN apk --update add git && \
    rm -rf /var/lib/apt/lists/* && \
    rm /var/cache/apk/*

# Install dependencies
COPY package*.json ./

RUN npm install

# Copy sources
COPY . .

ENTRYPOINT [ "node", "/app/cli" ]
