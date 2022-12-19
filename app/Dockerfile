FROM node:18.12-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY . .
RUN npm install --production=false && \
    npm run build && \
    rm -rf src/ && \
    rm -rf manifests && \
    rm -rf node_modules && \
    npm install

CMD [ "node", "./dist/app.js" ]