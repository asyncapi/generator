FROM node:18-alpine

ARG ASYNCAPI_GENERATOR_VERSION=1.10.9

WORKDIR /app

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Install git, chromium, and required libs
RUN apk add --no-cache \
    git \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont && \
    npm install --ignore-scripts -g "@asyncapi/generator@${ASYNCAPI_GENERATOR_VERSION}"

ENTRYPOINT ["ag"]
CMD ["--help"]

