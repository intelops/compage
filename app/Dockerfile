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

ARG USER_NAME=compageuser
ARG GROUP_NAME=compagegroup
### Add new user
RUN addgroup -g 1001 $GROUP_NAME && adduser -D -u 1001 -G $GROUP_NAME $USER_NAME
USER $USER_NAME

### create workdir directory
RUN mkdir -p $HOME/.compage/workdir
RUN chmod -R 777 $HOME/.compage/workdir
RUN chown -R $USER_NAME:$GROUP_NAME $HOME/.compage/workdir

### create logs directory
RUN mkdir -p $HOME/.compage/logs
RUN chmod -R 777 $HOME/.compage/logs
RUN chown -R $USER_NAME:$GROUP_NAME $HOME/.compage/logs

ENV NODE_ENV=production
EXPOSE 5000
CMD [ "node", "dist/src/app.js" ]