#!/usr/bin/env bash
set -e

if [ -z "$1" ]; then
  echo "No package info"
  exit 0
fi

PACKAGE=$1

  yarn install --frozen-lockfile
  yarn lint
  yarn format
  yarn test:cov
  find . -name "*.tgz" -type f -delete
  yarn build:all

cd /app/packages/${PACKAGE}
rm -rf node_modules

export CURRENT_VERSION=$(cat package.json |
  grep version |
  head -1 |
  awk -F: '{ print $2 }' |
  sed 's/[",]//g')

yarn cache clean --all
yarn install --production=true
npm pack

yarn publish --access public --new-version ${CURRENT_VERSION}

exit 0
