# FROM node:20 AS base

# WORKDIR /usr/local/app

# COPY package.json .
# RUN npm install -D tailwindcss@3 postcss autoprefixer
# RUN npx tailwindcss init -p
# RUN npm install
# COPY . .
# # RUN npm run build
# EXPOSE 8080
# # CMD ["npm", "run", "preview"]
# CMD ["npm", "run", "dev"]
FROM node:20-alpine

WORKDIR /usr/local/app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Start the development server
CMD ["npm", "run", "dev", "--", "--host"]