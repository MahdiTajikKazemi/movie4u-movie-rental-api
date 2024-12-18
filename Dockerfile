FROM node:14.16.0-alpine3.13

WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
COPY . .

EXPOSE 3333

CMD ["npm", "run", "dev"]