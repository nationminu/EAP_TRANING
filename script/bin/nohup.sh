#!/bin/sh
. ./env.sh 
unset JAVA_OPTS

tail -f $JBOSS_LOG_DIR/nohup/$SERVER_NAME.out
