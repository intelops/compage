FROM node:18.12-alpine as build
WORKDIR /app
COPY . .
RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*
RUN yarn install # --production=true
CMD ["yarn","run", "start"]