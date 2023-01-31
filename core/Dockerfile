################ Build & Dev ################
# Build stage will be used:
# - for building the application for production
# - as target for development (see devspace.yaml)
FROM golang:1.19.4-alpine3.17 as builder

# Create project directory (workdir)
WORKDIR /app

# Add source code files to WORKDIR
ADD . .

# Build application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -ldflags '-extldflags "-static"' -o main .

# Container start command for development
# Allows DevSpace to restart the dev container
# It is also possible to override this in devspace.yaml via images.*.cmd
CMD ["go", "run", "main.go"]


################ Production ################
FROM node:18.12-alpine
RUN npm install @openapitools/openapi-generator-cli -g
COPY --from=builder /app/main /
ADD templates /app/templates
# Application port (optional)
EXPOSE 8080
EXPOSE 50051

# Container start command for production
CMD ["/main"]
