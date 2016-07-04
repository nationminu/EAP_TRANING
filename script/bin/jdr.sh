#!/bin/sh
. ./env.sh 

unset JAVA_OPTS
$JBOSS_HOME/bin/jdr.sh $@

tar cvfz khan_sosreport_$DATE.tar.gz configuration/ $JBOSS_LOG_DIR/ *.sh *.properties
