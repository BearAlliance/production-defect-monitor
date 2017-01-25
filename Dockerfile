FROM node:alpine
MAINTAINER NickCacace@gmail.com

RUN mkdir -p /opt/osha

ADD . /opt/osha

WORKDIR /opt/osha
RUN npm install
EXPOSE 3000