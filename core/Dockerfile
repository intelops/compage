################ Build & Dev ################
# Build stage will be used:
# - for building the application for production
# - as target for development (see devspace.yaml)
FROM golang:1.20.5-alpine3.18 as builder

# Create project directory (workdir)
WORKDIR /app

# copy source code files to WORKDIR
COPY . .

# Build application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -ldflags '-extldflags "-static"' -o core .
# Container start command for development
# Allows DevSpace to restart the dev container
# It is also possible to override this in devspace.yaml via images.*.cmd
CMD ["go", "run", "main.go"]

################ Production ################
FROM alpine:3.18.2
# Create project directory (workdir)
WORKDIR /app

RUN apk update && apk add protoc && apk add dos2unix && apk add openjdk11 && apk add make && apk add bash && apk add curl && apk add jq && apk add --update go \
    && curl https://raw.githubusercontent.com/OpenAPITools/openapi-generator/master/bin/utils/openapi-generator-cli.sh \
    > /app/openapi-generator-cli \
    && chmod a+x /app/openapi-generator-cli

# Downloading and installing Maven
ARG MAVEN_VERSION=3.9.4
ARG BASE_URL=https://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries
RUN mkdir -p /usr/share/maven /usr/share/maven/ref \
  && echo "Downloading maven" \
  && curl -fsSL -o /tmp/apache-maven.tar.gz ${BASE_URL}/apache-maven-${MAVEN_VERSION}-bin.tar.gz \
  && echo "Unzipping maven" \
  && tar -xzf /tmp/apache-maven.tar.gz -C /usr/share/maven --strip-components=1 \
  && echo "Cleaning and setting links" \
  && rm -f /tmp/apache-maven.tar.gz \
  && ln -s /usr/share/maven/bin/mvn /usr/bin/mvn

# test if the below command avoids loading the files later.
RUN /app/openapi-generator-cli version
RUN go version
RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
RUN go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

ARG USER_NAME=compageuser
ARG GROUP_NAME=compagegroup
RUN addgroup -g 1001 $GROUP_NAME && adduser -D -u 1001 -G $GROUP_NAME $USER_NAME
ENV HOME "/home/"$USER_NAME
RUN chown $USER_NAME:$GROUP_NAME /app
USER $USER_NAME

RUN mkdir -p $HOME/.compage/workdir
RUN chmod -R 777 $HOME/.compage/workdir
ENV MAVEN_HOME /usr/share/maven
ENV MAVEN_CONFIG "$HOME/.m2"

ENV PATH="/usr/local/go/bin:$PATH:/app/"
ENV GOPATH $HOME/go
ENV PATH $GOPATH/bin:/usr/local/go/bin:$PATH
RUN mkdir -p "$GOPATH/src" "$GOPATH/bin" && chmod -R 777 "$GOPATH"

COPY --from=builder /app/core /
COPY templates /app/templates

# Application port (optional)
EXPOSE 8080
EXPOSE 50051
# Container start command for production
CMD ["/core"]
