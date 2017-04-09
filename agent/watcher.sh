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

	memoryTotal=`cat /proc/meminfo | grep MemTotal | awk '{ print $2 }'`
	memoryFree=`cat /proc/meminfo | grep MemFree | awk '{ print $2 }'`
	memoryBuffers=`cat /proc/meminfo | grep Buffers | awk '{ print $2 }'`
	memoryCached=`cat /proc/meminfo | grep "^Cached" | awk '{ print $2 }'`
	memorySReclaimable=`cat /proc/meminfo | grep SReclaimable | awk '{ print $2 }'`
	memorySwapCached=`cat /proc/meminfo | grep SwapCached | awk '{ print $2 }'`
	memoryNFSUnstable=`cat /proc/meminfo | grep NFS_Unstable | awk '{ print $2 }'`
	memoryUsed=`free | grep "Mem:" | awk '{ print $3 }'`

	memoryRealUsed=$((memoryUsed - (memoryBuffers + memoryCached + memorySReclaimable + memorySwapCached + memoryNFSUnstable) ))

	jsonPayload="{\"hostname\": \"$hostname\",\"time\":\"$currentTime\",\"cpuLoadAverage\":$cpuLoadAverage,\"numberOfProcessors\":$numberOfProcessors,\"memoryTotal\":$memoryTotal,\"memoryUsed\":$memoryRealUsed}"

	curl -X POST --header "data: $jsonPayload" $ip:2017
	echo " . Done"

	sleep $delay
done
