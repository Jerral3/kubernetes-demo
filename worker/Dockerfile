FROM python:3.6.4-slim-stretch

RUN mkdir -p /worker
RUN mkdir -p /data

RUN apt-get -y update && apt-get install -y glusterfs-client

WORKDIR /worker

COPY . /worker

RUN pip install -r requirements.txt

ENTRYPOINT ["bash", "start.sh"]
