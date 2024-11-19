
# Use Node.js as the base image
FROM node:18.0.0-alpine

# Set the working directory
WORKDIR /app

COPY package*.json ./

RUN npm i

USER node

# Copy the service's code
COPY . .

# Expose a port (adjust as per your service's configuration)
EXPOSE 8002

# Command to start the service
CMD ["npm", "start"]
