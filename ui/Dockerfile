# build environment
FROM node:18.12-alpine as builder
WORKDIR /app
COPY . .
RUN npm install -g npm@latest && npm install --production=false
RUN npm run build:production

# production environment
FROM nginx:1.23.3-alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY --from=builder /app/conf /etc/nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]