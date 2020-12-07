FROM node:lts

WORKDIR /app
COPY package.json /app
COPY yarn.lock /app

RUN yarn install

COPY . /app

CMD ["yarn", "run", "start"]
