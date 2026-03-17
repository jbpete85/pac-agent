FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production=false

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
