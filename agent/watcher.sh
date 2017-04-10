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
	memoryUsed=$(( memoryTotal - memoryFree ))

	memoryRealUsed=$(( memoryTotal - (memoryFree + memoryBuffers + memoryCached) ))

	echo -n "{" > jsonFilesystems.json
	dirListing=`df | grep -v Filesystem`
	lineCounter=1
	numberOfLines=`df | grep -v Filesystem | wc -l`
	df | grep -v Filesystem | while read line; do
	    mountPath=`echo $line | awk '{ print $6 }'`
	    mountAvailable=`echo $line | awk '{ print $4 }'`
	    mountUsed=`echo $line | awk '{ print $3 }'`
	    mountTotal=`echo $line | awk '{ print $2 }'`
	    mountFilesystem=`echo $line | awk '{ print $1 }'`

	    comma=","
	    if [ "$numberOfLines" -eq "$lineCounter" ]; then
	    	comma=""
	    fi
	    ((lineCounter++))

		echo -n "\"$mountPath\": { \"mountAvailable\": \"$mountAvailable\", \"mountUsed\": \"$mountUsed\", \"mountFilesystem\": \"$mountFilesystem\" , \"mountTotal\": \"$mountTotal\" }$comma" >> jsonFilesystems.json
	done
	echo -n "}" >> jsonFilesystems.json

	jsonFilesystems=`cat jsonFilesystems.json`
	rm jsonFilesystems.json

	jsonPayload="{\"hostname\": \"$hostname\",\"time\":\"$currentTime\",\"cpuLoadAverage\":$cpuLoadAverage,\"numberOfProcessors\":$numberOfProcessors,\"memoryTotal\":$memoryTotal,\"memoryUsed\":$memoryRealUsed,\"partitions\":$jsonFilesystems}"
	curl -X POST --header "data: $jsonPayload" $ip:2017
	echo " . Done"

	sleep $delay
done
