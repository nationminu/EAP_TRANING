#!/bin/sh
. ./env.sh $*

unset JAVA_OPTS

JBOSS_MODULEPATH="$JBOSS_HOME/modules/system/layers/base"

CLASSPATH=$CLASSPATH:$JAVA_HOME/lib/tools.jar

MODULES="org/picketbox org/jboss/remoting3 org/jboss/logging"

for MODULE in $MODULES
do
    for JAR in `cd "$JBOSS_MODULEPATH/$MODULE/main/" && ls -1 *.jar`
    do
        CLASSPATH="$CLASSPATH:$JBOSS_MODULEPATH/$MODULE/main/$JAR"
    done
done

export CLASSPATH

if [ $# -eq 0 ]
  then
    echo "Usage: $ encrypt.sh <message to encrypt>"
    exit;
fi

java org.picketbox.datasource.security.SecureIdentityLoginModule $*
