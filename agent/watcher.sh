#!/bin/bash
ip=$1
delay=$2

hostname=`cat /etc/hostname`
numberOfProcessors=`nproc`

for (( ; ; ))
do
	echo -n "Sending data . "
	currentTime=`date -u +"%Y-%m-%dT%H:%M:%SZ"`
	cpuLoadAverage=`uptime | grep -ohe 'load average[s:][: ].*' | awk '{ print $3 }' | awk --field-separator "," '{ print $1 }'`

	jsonPayload="{\"hostname\": \"$hostname\",\"time\":\"$currentTime\",\"cpuLoadAverage\":$cpuLoadAverage,\"numberOfProcessors\":$numberOfProcessors}"

	curl -X POST --header "data: $jsonPayload" $ip:2017
	echo "done"

	sleep $delay
done
