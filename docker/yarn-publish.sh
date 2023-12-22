#!/usr/bin/env bash
set -e

export CURRENT_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

yarn install --frozen-lockfile \
  && yarn lint \
  && yarn format \
  && rm -rf *.tgz \
  && yarn test:cov \
  && yarn build \
  && npm pack \
  && yarn publish --new-version ${CURRENT_VERSION}

 exit 0;
