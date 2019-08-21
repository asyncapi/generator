#!/bin/bash

if [ -z "$1" ]; then
    echo "No argument supplied"
    exit 1
fi

if [ "$1" == "ag" ]; then
    shift
    node /asyncapi/cli "$@"
else
   echo "Unknown command"
   exit 1
fi
