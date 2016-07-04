#!/bin/sh

. ./env.sh

PID=`ps -ef | grep java | grep "=$SERVER_NAME " | awk '{print $2}'`
echo $PID

if [ e$PID != "e" ]
then
    echo "JBoss SERVER - $SERVER_NAME is already RUNNING..."
    exit;
fi

UNAME=`id -u -n`
if [ e$UNAME != "e$JBOSS_USER" ]
then
    echo "Use $JBOSS_USER account to start JBoss SERVER - $SERVER_NAME..."
    exit;
fi

echo $JAVA_OPTS

if [ ! -d "$JBOSS_LOG_DIR/nohup" ];
then
    mkdir -p $JBOSS_LOG_DIR/nohup
fi  

if [ ! -d "$JBOSS_LOG_DIR/gclog" ];
then
    mkdir -p $JBOSS_LOG_DIR/gclog
fi  

if [ ! -d "$JBOSS_LOG_DIR/heapdump" ];
then
    mkdir -p $JBOSS_LOG_DIR/heapdump
fi  

mv $JBOSS_LOG_DIR/nohup/$SERVER_NAME.out $JBOSS_LOG_DIR/nohup/$SERVER_NAME.out.$DATE

rm -rf $DOMAIN_BASE/$SERVER_NAME/tmp/*

export JAVA_OPTS="$AGENT_OPTS $JAVA_OPTS"

nohup $JBOSS_HOME/bin/standalone.sh -DSERVER=$SERVER_NAME -P=$DOMAIN_BASE/$SERVER_NAME/bin/env.properties -c $CONFIG_FILE >> $JBOSS_LOG_DIR/nohup/$SERVER_NAME.out 2>&1 &
