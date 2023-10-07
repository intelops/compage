# build environment
FROM node:18.18.0-alpine3.18 as builder
WORKDIR /app
COPY . .
RUN npm install -g npm@latest && npm install --production=false && \
    npm run build && \
    rm -rf src/ && \
    rm -rf manifests && \
    rm -rf node_modules && \
    npm install

# production environment
FROM node:18.18.0-alpine3.18
WORKDIR /server
RUN apk update && apk add git
COPY --from=builder /app/dist /server/dist
COPY --from=builder /app/node_modules /server/node_modules
COPY --from=builder /app/protobufs /server/protobufs
RUN mkdir -p /compage/workdir
RUN chmod -R 777 /compage/workdir
ENV NODE_ENV=production
EXPOSE 5000
CMD [ "node", "dist/src/app.js" ]