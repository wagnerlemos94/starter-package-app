FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=development

# Install dependencies (use package-lock if present)
COPY package.json package-lock.json* ./
RUN npm ci --silent || npm install --silent

# Copy source (will be overridden by bind mount in dev)
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
