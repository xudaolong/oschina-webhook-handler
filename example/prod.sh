#!/bin/bash
cd /your/project/path
npm run stop
git checkout
git pull origin master
npm install
npm run start
