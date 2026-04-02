FROM golang:1.25-alpine 

# Install Chromium and its dependencies + curl for healthcheck
RUN apk add --no-cache \
    curl \
    chromium \
    chromium-chromedriver \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto \
    font-noto-emoji

# Tell chromedp where to find the Chromium binary
ENV CHROMEDP_NO_SANDBOX=true
ENV CHROME_BIN=/usr/bin/chromium-browser

WORKDIR /app/server

COPY server/go.mod server/go.sum ./
RUN go mod download && go mod verify

COPY server .

RUN go build -o ./bin/BiTE ./cmd

ENV GO_ENV=production

EXPOSE 5000

ENTRYPOINT ["./bin/BiTE"]