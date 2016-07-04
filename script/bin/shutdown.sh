#!/bin/sh
. ./env.sh 
unset JAVA_OPTS

$JBOSS_HOME/bin/jboss-cli.sh --connect --controller=$CONTROLLER_IP:$CONTROLLER_PORT --command=:shutdown
