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

	memoryTotal=`free | grep "Mem:" | awk '{ print $2 }'`
	memoryUsed=`free | grep "Mem:" | awk '{ print $3 }'`
	memoryFree=`free | grep "Mem:" | awk '{ print $4 }'`
	memoryShared=`free | grep "Mem:" | awk '{ print $5 }'`
	memoryBuffers=`free | grep "Mem:" | awk '{ print $6 }'`
	memoryCached=`free | grep "Mem:" | awk '{ print $7 }'`

	jsonPayload="{\"hostname\": \"$hostname\",\"time\":\"$currentTime\",\"cpuLoadAverage\":$cpuLoadAverage,\"numberOfProcessors\":$numberOfProcessors,\"memoryTotal\":$memoryTotal,\"memoryUsed\":$memoryUsed,\"memoryFree\":$memoryFree,\"memoryShared\":$memoryShared,\"memoryBuffers\":$memoryBuffers,\"memoryCached\":$memoryCached}"

	curl -X POST --header "data: $jsonPayload" $ip:2017
	echo "done"

	sleep $delay
done
