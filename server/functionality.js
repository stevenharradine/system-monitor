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

updatePage ();

function updatePage () {
    fetchJSONFile('data.json', function(data){
        var table  = "<table>"
            table += "<tr>"
            table += "<th>Hostname</th>"
            table += "<th>CPU Load</th>"
            table += "<th>RAM</th>"
            table += "<th>Last updated</th>"
            table += "</tr>"

        for (var hostname in data) {
            table += "<tr>"
            table += "<td>" + hostname + "</td>"
            table += "<td><canvas id='" + hostname + "-cpu' data-units='CPU Load' data-type='radial-gauge' data-value='" + cpuLoad + "'></canvas></td>"
            table += "<td><canvas id='" + hostname + "-ram'></canvas></td>"
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

            var ramUnits = "KB" // default units for free command
            var ramTotal = data[hostname]["memoryTotal"]
            var ramUsed = data[hostname]["memoryUsed"];

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

            var ramRadial = new RadialGauge({
                renderTo: hostname + '-ram',
                width: width,
                height: height,
                units: ramUnits,
                title: "RAM",
                value: ramUsed,
                minValue: 0,
                maxValue: ramTotal,
                majorTicks: [
                    Math.round (ramTotal/5),
                    Math.round ((ramTotal/5) * 2),
                    Math.round ((ramTotal/5) * 3),
                    Math.round ((ramTotal/5) * 4),
                    Math.round (ramTotal)
                ],
                minorTicks: 2,
                valueBox: true
            })
            ramRadial.draw()
        }

        setTimeout( function () {
            updatePage ()
        }, 3000)
    })
}
