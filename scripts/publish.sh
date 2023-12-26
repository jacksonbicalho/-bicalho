#!/usr/bin/env bash
set -e


if [ -z "$1" ]; then
  echo "No package info"
  exit 0
fi
PACKAGE=$1
TARGET=publish docker-compose run --rm app yarn-publish.sh ${PACKAGE}
