#!/bin/sh

DATE=`date +%Y%m%d`

if [ ! -d "log/$DATE" ];
then
    mkdir "log/$DATE"
fi

java -cp js-14.jar:js.jar:jboss-cli-client.jar org.mozilla.javascript.tools.shell.Main -f ./script/text.js >> ./log/$DATE/text.log
