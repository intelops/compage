FROM node:16.18-alpine

# Set working directory
WORKDIR /app

# Add package.json to WORKDIR and install dependencies
COPY package*.json ./
COPY yarn*.lock ./

RUN npm install
RUN npm install pm2 -g
RUN npm run build

# Copy build files
COPY ./dist .
COPY protobufs .

# Application port (optional)
EXPOSE 5000

# Container start command (DO NOT CHANGE and see note below)
CMD ["pm2-runtime","app.js"]
