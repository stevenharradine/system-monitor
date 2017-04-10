function fetchJSONFile(path, callback) {
    var httpRequest = new XMLHttpRequest()
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var data = JSON.parse(httpRequest.response)
                if (callback) callback(data)
            }
        }
    }
    httpRequest.open('GET', path)
    httpRequest.send()
}

var guages = []
updatePage ()

function updatePage () {
    fetchJSONFile('data.json', function(data){
        // TODO: temp fix for memory leak, need to reuse the existing elements to get them to update (and animate)
        for (i = 0; i < guages.length; i++){
                guages[i].destroy()
        }
        guages=[]

        var table  = "<table>"
            table += "<tr>"
            table += "<th>Hostname</th>"
            table += "<th>CPU Load</th>"
            table += "<th>RAM</th>"
            table += "<th>Partitions</th>"
            table += "<th>Last updated</th>"
            table += "</tr>"

        for (var hostname in data) {
            table += "<tr>"
            table += "<td>" + hostname + "</td>"
            table += "<td><canvas id='" + hostname + "-cpu' data-units='CPU Load' data-type='radial-gauge' data-value='" + cpuLoad + "'></canvas></td>"
            table += "<td><canvas id='" + hostname + "-ram'></canvas></td>"
            table += "<td><canvas id='" + hostname + "-disk'></canvas></td>"
            table += "<td>" + data[hostname]["time"] + "</td>"
            table += "</tr>"
        }

        table += "</table>"

        document.getElementById("table").innerHTML = table

        for (var hostname in data) {
            var width = 200
            var height = 200

            var cpuLoad = (data[hostname]["cpuLoadAverage"] / data[hostname]["numberOfProcessors"]) * 100
            var cpuRadial = new RadialGauge({
                renderTo: hostname + '-cpu',
                width: width,
                height: height,
                units: '%',
                title: "CPU Load",
                value: cpuLoad,
                minValue: 0,
                maxValue: 100,
                majorTicks: [
                    '0',
                    '20',
                    '40',
                    '60',
                    '80',
                    '100'
                ],
                minorTicks: 2,
                valueBox: true
            })
            cpuRadial.draw()
            guages.push(cpuRadial);

            var ramUnits = "KB" // default units for free command
            var ramTotal = data[hostname]["memoryTotal"]
            var ramUsed = data[hostname]["memoryUsed"]

            if (ramTotal / 1024 > 1) {
                ramTotal /= 1024
                ramUnits = "MB"
            }
            if (ramTotal / 1024 > 1) {
                ramTotal /= 1024
                ramUnits = "GB"
            }
            if (ramTotal / 1024 > 1) {
                ramTotal /= 1024
                ramUnits = "TB"
            }

            if (ramUnits == "MB") {
                ramUsed /= 1024
            } else if (ramUnits == "GB") {
                ramUsed /= 1024
                ramUsed /= 1024
            } else if (ramUnits == "TB") {
                ramUsed /= 1024
                ramUsed /= 1024
                ramUsed /= 1024
            }

            ramSteps = []
            ramSteps[0] = 0
            ramSteps[1] = round ((ramTotal/5) * 1, 2)
            ramSteps[2] = round ((ramTotal/5) * 2, 2)
            ramSteps[3] = round ((ramTotal/5) * 3, 2)
            ramSteps[4] = round ((ramTotal/5) * 4, 2)
            ramSteps[5] = round ((ramTotal/5) * 5, 2)

            var ramRadial = new RadialGauge({
                renderTo: hostname + '-ram',
                width: width,
                height: height,
                units: ramUnits,
                title: "RAM",
                value: ramUsed,
                minValue: 0,
                maxValue: ramTotal,
                majorTicks: ramSteps,
                highlights: [
                    { from: 0, to: ramTotal*.3, color: 'rgba(0,0,0,0)' },
                    { from: ramTotal*.3, to: ramTotal*.65, color: 'rgba(0,0,0,.05)' },
                    { from: ramTotal*.65, to: ramTotal*.85, color: 'rgba(0,0,0,.2)' },
                    { from: ramTotal*.85, to: ramTotal, color: 'rgba(0,0,0,.4)' }
                ],
                minorTicks: 2,
                valueBox: true
            })
            ramRadial.draw()
            guages.push(ramRadial);

            var mountAvailable = data[hostname]["partitions"]["/"]["mountAvailable"]
            var mountUsed = data[hostname]["partitions"]["/"]["mountUsed"]
            var mountTotal = data[hostname]["partitions"]["/"]["mountTotal"]

            var diskTotal = mountTotal
            var diskUsed = mountUsed
            var diskUnits = "KB"
            if (diskTotal / 1024 > 1) {
                diskTotal /= 1024
                diskUnits = "MB"
            }
            if (diskTotal / 1024 > 1) {
                diskTotal /= 1024
                diskUnits = "GB"
            }
            if (diskTotal / 1024 > 1) {
                diskTotal /= 1024
                diskUnits = "TB"
            }

            if (diskUnits == "MB") {
                diskUsed /= 1024
            } else if (diskUnits == "GB") {
                diskUsed /= 1024
                diskUsed /= 1024
            } else if (diskUnits == "TB") {
                diskUsed /= 1024
                diskUsed /= 1024
                diskUsed /= 1024
            }

            diskSteps = []
            diskSteps[0] = 0
            diskSteps[1] = round ((diskTotal/5) * 1, 2)
            diskSteps[2] = round ((diskTotal/5) * 2, 2)
            diskSteps[3] = round ((diskTotal/5) * 3, 2)
            diskSteps[4] = round ((diskTotal/5) * 4, 2)
            diskSteps[5] = round ((diskTotal/5) * 5, 2)

            var diskRadial = new RadialGauge({
                renderTo: hostname + '-disk',
                width: width,
                height: height,
                units: diskUnits,
                title: "/",
                value: diskUsed,
                minValue: 0,
                maxValue: diskTotal,
                majorTicks: diskSteps,
                highlights: [
                    { from: 0, to: diskTotal*.50, color: 'rgba(0,0,0,0)' },
                    { from: diskTotal*.50, to: diskTotal*.75, color: 'rgba(0,0,0,.05)' },
                    { from: diskTotal*.75, to: diskTotal*.90, color: 'rgba(0,0,0,.2)' },
                    { from: diskTotal*.90, to: diskTotal, color: 'rgba(0,0,0,.4)' }
                ],
                minorTicks: 2,
                valueBox: true
            })
            diskRadial.draw()
            guages.push(diskRadial);
        }

        setTimeout( function () {
            updatePage ()
        }, 3000)
    })
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}
