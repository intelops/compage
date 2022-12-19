FROM node:18.12-alpine
WORKDIR /app
RUN apk update
RUN apk add git
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
COPY protobufs protobufs
ENV NODE_ENV=production
EXPOSE 5000
RUN npm install
RUN npm install ts-node -g
RUN ["npm", "i", "npm@8.12", "-g"]
CMD ["npm", "run", "start-prod"]


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