FROM node:latest

RUN apt-get clean all
RUN apt-get update
RUN apt update
RUN apt -y install wget curl

RUN mkdir /mnt/nodetron
COPY ./engine/package.json ./engine/package-lock.json /mnt/nodetron/

WORKDIR /mnt/nodetron
RUN npm install

COPY ./engine /mnt/nodetron/

EXPOSE 3001

CMD [ "node", "./server.js", "config/example/app_config.json"]
