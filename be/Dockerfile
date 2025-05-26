FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production 
# --production = tanpa devDepedencies
COPY . .
EXPOSE 5001
CMD ["node", "index.js"]
