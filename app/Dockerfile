FROM node:18.12-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY . .
RUN apk update && apk add git
RUN npm install -g npm@latest && npm install --production=false && \
    npm run build && \
    rm -rf src/ && \
    rm -rf manifests && \
    rm -rf node_modules && \
    npm install

CMD [ "node", "./dist/app.js" ]