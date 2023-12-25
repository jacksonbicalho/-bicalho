#!/usr/bin/env bash
set -e

if [ "$1" = 'yarn' ]; then
  exec /usr/local/bin/yarn "$@"
fi

echo $@

