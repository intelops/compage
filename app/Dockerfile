# build environment
FROM node:18.15-alpine as builder
WORKDIR /app
COPY . .
RUN npm install -g npm@latest && npm install --production=false && \
    npm run build && \
    rm -rf src/ && \
    rm -rf manifests && \
    rm -rf node_modules && \
    npm install

# production environment
FROM node:18.15-alpine
WORKDIR /server
RUN apk update && apk add git
COPY --from=builder /app/dist /server/dist
COPY --from=builder /app/node_modules /server/node_modules
COPY --from=builder /app/protobufs /server/protobufs

ENV NODE_ENV=production
EXPOSE 5000
CMD [ "node", "dist/app.js" ]