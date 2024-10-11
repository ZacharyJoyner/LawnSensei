# Use Node.js for building the client
FROM node:18 AS build
WORKDIR /app

# Install dependencies
COPY lawnsensei.client/package*.json ./
RUN npm install

# Copy the rest of the application code and build it
COPY lawnsensei.client/ ./
RUN npm run build

# Use an Nginx server to serve the frontend
FROM nginx:alpine AS serve
COPY --from=build /app/dist /usr/share/nginx/html
