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
            table += "<th>cpuLoadAverage</th>"
            table += "<th>numberOfProcessors</th>"
            table += "<th>memoryTotal</th>"
            table += "<th>memoryUsed</th>"
            table += "<th>memoryFree</th>"
            table += "<th>memoryShared</th>"
            table += "<th>memoryBuffers</th>"
            table += "<th>memoryCached</th>"
            table += "<th>Last updated</th>"
            table += "</tr>"

        for (var hostname in data) {
            table += "<tr>"
            table += "<td>" + hostname + "</td>"
            table += "<td>" + data[hostname]["cpuLoadAverage"] + "</td>"
            table += "<td>" + data[hostname]["numberOfProcessors"] + "</td>"
            table += "<td>" + data[hostname]["memoryTotal"] + "</td>"
            table += "<td>" + data[hostname]["memoryUsed"] + "</td>"
            table += "<td>" + data[hostname]["memoryFree"] + "</td>"
            table += "<td>" + data[hostname]["memoryShared"] + "</td>"
            table += "<td>" + data[hostname]["memoryBuffers"] + "</td>"
            table += "<td>" + data[hostname]["memoryCached"] + "</td>"
            table += "<td>" + data[hostname]["time"] + "</td>"
            table += "</tr>"
        }

        table += "</table>"

        document.getElementById("table").innerHTML = table

        setTimeout( function () {
            updatePage ()
        }, 3000)
    })
}