#!/bin/bash

git add .
echo Enter commit message:
read message
git commit -m "$message"
echo Pushing "$message"
git push -u origin master && echo Pushed "$message"