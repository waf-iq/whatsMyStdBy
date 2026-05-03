FROM mcr.microsoft.com/playwright:v1.59.1-jammy

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Link Playwright browsers
RUN npx playwright install chromium

# Copy the rest of the application code
COPY . .

# Build Next.js application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
