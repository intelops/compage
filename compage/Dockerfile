FROM node:16.18-alpine

# Set working directory
WORKDIR /app

# Add package.json to WORKDIR and install dependencies
COPY package*.json ./
RUN npm install
RUN npm install -g ts-node

# Add source code files to WORKDIR
COPY . .

# Application port (optional)
EXPOSE 5000

# Container start command (DO NOT CHANGE and see note below)
CMD ["ts-node", "server.ts"]
