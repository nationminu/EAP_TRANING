#!/bin/sh
. ./env.sh 
unset JAVA_OPTS

ps -ef | grep java | grep "SERVER=$SERVER_NAME "
