# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port used by the app
EXPOSE 3002

# Command to run the app
CMD ["npm", "run", "dev"]
