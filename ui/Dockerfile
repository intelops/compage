FROM node:18.12-alpine
WORKDIR /app
COPY . .
RUN yarn install --production=true
RUN yarn run build
RUN yarn global add pm2@5.2.2
EXPOSE 3000
CMD ["pm2-runtime","app.js"]