FROM node:18.12-alpine
WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
COPY protobufs protobufs
RUN yarn install
ENV NODE_ENV=production
CMD ["yarn", "run", "start"]


### this is stage two , where the app actually runs
#FROM node:18.12-alpine
#WORKDIR /app
#COPY package.json ./
#COPY protobufs protobufs
#RUN yarn install --production=true
#COPY --from=0 /app/dist .
#RUN yarn global add pm2@5.2.2
#EXPOSE 5000
#ENV NODE_ENV=production
#CMD ["pm2-runtime","app.js"]