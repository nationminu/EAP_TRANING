#!/bin/sh
. ./env.sh

unset JAVA_OPTS

for count in 1 2 3 4 5; do
    echo "Thread Dump : $count"
    for i in `ps -ef | grep java |grep "SERVER=$SERVER_NAME " | awk '{print $2}'`;do
        top -H -b -n1 >> dump_high_cpu_$i.txt
        date
        #kill -3 $i
        jstack -l $i >> dump_high_cpu_$i.txt
        echo "cpu snapshot and thread dump done. #" 
    done
    echo "done"
    sleep 3
done
