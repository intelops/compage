FROM node:18.12-alpine as build
WORKDIR /app
COPY . .
RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*
RUN npm install
ENV WDS_SOCKET_PORT=32222
EXPOSE 3000
CMD ["npm","run", "k8s-start"]