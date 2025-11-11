#!/bin/bash

# Docker
cd "$(dirname "$0")"/docker || exit 1
docker-compose up -d

cd .. || exit 1
cd backend || exit 1

# Compile and run Java program
mvn clean compile
mvn exec:java "-Dexec.mainClass=TestConnectDB"