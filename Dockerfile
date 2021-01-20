FROM node:latest

RUN apt-get clean all
RUN apt-get update
RUN apt update

RUN mkdir /mnt/ab-tester
WORKDIR /mnt/ab-tester

COPY ./engine/package.json ./engine/package-lock.json /mnt/ab-tester/

RUN npm ci

COPY ./engine /mnt/ab-tester

EXPOSE 3001

ENTRYPOINT [ "node", "./server.js", "config/app_config.json"]
