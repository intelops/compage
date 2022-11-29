FROM node:18.12-alpine
WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
COPY protobufs protobufs
COPY .env .
RUN yarn install
RUN yarn run build

## this is stage two , where the app actually runs
FROM node:18.12-alpine
WORKDIR /app
COPY package.json ./
RUN yarn install --production=true
COPY --from=0 /app/dist .
RUN yarn global add pm2@5.2.2
EXPOSE 5000

CMD ["pm2-runtime","app.js"]