FROM node:latest

RUN apt-get clean all
RUN apt-get update
RUN apt update

RUN mkdir /mnt/abtester
ADD ./engine /mnt/abtester
WORKDIR /mnt/abtester

RUN npm install

ARG PORT=3001
ENV PORT=${PORT}
EXPOSE $PORT

ENTRYPOINT [ "node", "./server.js", "config/example/app_config.json"]
