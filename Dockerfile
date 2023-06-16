FROM node:16.17

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY views views

COPY out out

EXPOSE 3000

CMD ["node", "out/index.js"]