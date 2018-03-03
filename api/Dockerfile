FROM node:7.10

RUN mkdir -p /api
RUN mkdir -p /data

RUN apt-get -y update && apt-get -y install glusterfs-client

WORKDIR /api

COPY . /api

RUN npm install
EXPOSE 3000

ENTRYPOINT ["bash", "start.sh"]
