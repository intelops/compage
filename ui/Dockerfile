FROM node:18.12-alpine as build
WORKDIR /app
COPY . .
RUN yarn install # --production=true
RUN yarn run build
#RUN yarn global add pm2@5.2.2
#EXPOSE 3000
#CMD ["pm2-runtime","app.js"]

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]