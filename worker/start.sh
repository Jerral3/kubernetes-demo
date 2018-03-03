#!/bin/bash

mount.glusterfs 192.168.99.1:/gv1 /data
python /worker/worker.py
