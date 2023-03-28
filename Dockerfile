FROM node:latest

WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3030

CMD [ "npm", "run", "start:dev" ]