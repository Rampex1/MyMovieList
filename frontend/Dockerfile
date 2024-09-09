# Frontend Dockerfile

# Use the official Node.js image
FROM node:17-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the app source code to the container
COPY . .

# Build the app for production
RUN npm run build

# Expose port 3000 for the frontend
EXPOSE 3000

# Serve the built app using a simple HTTP server
RUN npm install -g serve

CMD ["serve", "-s", "build", "-l", "3000"]
