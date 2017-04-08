const http = require('http')  
const fs = require('fs')
const port = 2017
var systems = {}

const requestHandler = (request, response) => {
	if (request.method == "POST") {
		try {
			var payload = JSON.parse (request.headers.data)
			var hostname = payload.hostname
			var cpuLoadAverage = payload.cpuLoadAverage
			var numberOfProcessors = payload.numberOfProcessors
			var memoryTotal = payload.memoryTotal
			var memoryUsed = payload.memoryUsed
			var memoryFree = payload.memoryFree
			var memoryShared = payload.memoryShared
			var memoryBuffers = payload.memoryBuffers
			var memoryCached = payload.memoryCached
			var time = payload.time

			systems[hostname] = {}
			systems[hostname]['cpuLoadAverage'] = cpuLoadAverage
			systems[hostname]['numberOfProcessors'] = numberOfProcessors
			systems[hostname]['memoryTotal'] = memoryTotal
			systems[hostname]['memoryUsed'] = memoryUsed
			systems[hostname]['memoryFree'] = memoryFree
			systems[hostname]['memoryShared'] = memoryShared
			systems[hostname]['memoryBuffers'] = memoryBuffers
			systems[hostname]['memoryCached'] = memoryCached
			systems[hostname]['time'] = time

			response.write("Accepted")
		} catch (e) {
			response.write("Error")
		}
		response.end()

	} else if (request.method == "GET") {
		if (request.url == "/styles.css") {
			fs.readFile('styles.css', 'utf8', function (err,data) {
				if (err) {
					return console.log(err);
				}
				response.write(data)
				response.end()
			});
		} else if (request.url == "/functionality.js") {
			fs.readFile('functionality.js', 'utf8', function (err,data) {
				if (err) {
					return console.log(err);
				}
				response.write(data)
				response.end()
			});
		} else if (request.url == "/data.json") {
			response.write(JSON.stringify (systems))
			response.end()
		} else {
			var html = ""
			
			html += "<html><head>"
			html += "<title>System Monitor</title>"
			html += "<link rel='stylesheet' type='text/css' href='styles.css'>"
			html += "<body><script src='functionality.js' type='text/javascript'></script><div id='table'></div></body></html>"
/*
			html += "<table><tr>"
			html += "<th>Hostname</th>"
			html += "<th>cpuLoadAverage</th>"
			html += "<th>numberOfProcessors</th>"
			html += "<th>memoryTotal</th>"
			html += "<th>memoryUsed</th>"
			html += "<th>memoryFree</th>"
			html += "<th>memoryShared</th>"
			html += "<th>memoryBuffers</th>"
			html += "<th>memoryCached</th>"
			html += "<th>Last updated</th>"
			html += "</tr>"

			for(var hostname in systems){
				var cpuLoadAverage = systems[hostname]["cpuLoadAverage"];
				var numberOfProcessors = systems[hostname]["numberOfProcessors"];
				var memoryTotal = systems[hostname]["memoryTotal"];
				var memoryUsed = systems[hostname]["memoryUsed"];
				var memoryFree = systems[hostname]["memoryFree"];
				var memoryShared = systems[hostname]["memoryShared"];
				var memoryBuffers = systems[hostname]["memoryBuffers"];
				var memoryCached = systems[hostname]["memoryCached"];
				var time = systems[hostname]["time"];

				html += "<tr>"
				html += "<td>" + hostname + "</td>"
				html += "<td>" + cpuLoadAverage + "</td>"
				html += "<td>" + numberOfProcessors + "</td>"
				html += "<td>" + memoryTotal + "</td>"
				html += "<td>" + memoryUsed + "</td>"
				html += "<td>" + memoryFree + "</td>"
				html += "<td>" + memoryShared + "</td>"
				html += "<td>" + memoryBuffers + "</td>"
				html += "<td>" + memoryCached + "</td>"
				html += "<td>" + time + "</td>"
				html += "</tr>"
			}

			html += "</table>"*/

			response.write(html)
			response.end()
		}
	}



}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})