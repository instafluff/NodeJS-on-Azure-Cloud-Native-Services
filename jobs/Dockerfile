FROM node:8

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production && npm install typescript@latest -g

COPY . .

EXPOSE 8081
CMD [ "npm", "start" ]
