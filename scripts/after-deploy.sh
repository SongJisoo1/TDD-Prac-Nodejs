#!/bin/bash
REPOSITORY=/home/ubuntu/build

cd $REPOSITORY

sudo pm2 restart server.js