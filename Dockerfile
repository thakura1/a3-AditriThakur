# Use a stable Node version
FROM node:18.18.0

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy the rest of the project
COPY . .

# Expose the port Railway uses
ENV PORT=3000

# Start the app
CMD ["node", "server.improved.js"]
