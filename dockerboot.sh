#!/bin/bash

if [ -z "$1" ]; then
    echo "No argument supplied"
    exit 1
fi

if [ "$1" == "ag" ]; then
    shift
    node cli "$@"
elif [ "$1" == "anc" ]; then
    shift
    anc "$@"
else
   echo "Unknown command"
   exit 1
fi
