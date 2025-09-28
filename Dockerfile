# Use Node 16 for compatibility with react-scripts 4.0.1
FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including serve for static hosting
RUN npm ci --legacy-peer-deps && npm install -g serve

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Expose port 3000 (matching fly.toml)
EXPOSE 3000

# Serve the built app on all interfaces (serve defaults to 0.0.0.0)
CMD ["serve", "-s", "build", "-p", "3000"]