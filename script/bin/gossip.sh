#!/bin/sh
. ./env.sh $*

unset JAVA_OPTS

JBOSS_MODULEPATH="$JBOSS_HOME/modules/system/layers/base"

MODULES="org/jgroups"

for MODULE in $MODULES
do
    for JAR in `cd "$JBOSS_MODULEPATH/$MODULE/main/" && ls -1 *.jar`
    do
        CLASSPATH="$CLASSPATH:$JBOSS_MODULEPATH/$MODULE/main/$JAR"
    done
done

export CLASSPATH



PID=`ps -ef | grep java | grep "=GOSSIP_ROUTER " | awk '{print $2}'`
echo $PID

if [ e$PID != "e" ]
then
    echo "JBoss GOSSIP_ROUTER - is already RUNNING..."
    exit;
fi

nohup java -classpath $CLASSPATH -Dname=GOSSIP_ROUTER org.jgroups.stack.GossipRouter -port 12001 >> gossip.out &
