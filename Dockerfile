# Use official Node 20 image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Angular CLI and project dependencies
RUN npm install -g @angular/cli
RUN npm install --legacy-peer-deps

# Copy project files
COPY . .

# Expose port for Angular
EXPOSE 4200

# Development command with polling for hot reload
CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "1000"]