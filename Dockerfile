FROM node:10
WORKDIR /usr/src/phoenix-scout
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE+-703
EXPOSE+-9993
CMD [ "npm", "start" ]
