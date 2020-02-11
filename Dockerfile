FROM node:13.8.0-alpine3.11

WORKDIR /app

# Install dependencies
COPY package*.json ./

RUN npm install

# Copy sources
COPY . .

ENTRYPOINT [ "node", "/app/cli" ]
