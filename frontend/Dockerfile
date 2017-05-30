FROM node:7.8.0-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

VOLUME /usr/src/app

RUN npm install -g webpack
RUN npm install -g webpack-dev-server
RUN yarn install
