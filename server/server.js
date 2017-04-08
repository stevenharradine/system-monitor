const http = require('http')  
const port = 2017
var systems = {}

const requestHandler = (request, response) => {
	if (request.method == "POST") {
		var payload = JSON.parse (request.headers.data)
		var hostname = payload.hostname
		var cpuLoadAverage = payload.cpuLoadAverage
		var numberOfProcessors = payload.numberOfProcessors
		var time = payload.time

		systems[hostname] = {}
		systems[hostname]['cpuLoadAverage'] = cpuLoadAverage
		systems[hostname]['numberOfProcessors'] = numberOfProcessors
		systems[hostname]['time'] = time

		response.end()
	} else if (request.method == "GET") {
		var html = ""
		
		html += "<html><head><title>System Monitor</title><meta http-equiv='refresh' content='1'><body>"
		html += "<table><tr><th>Hostname</th><th>cpuLoadAverage</th><th>numberOfProcessors</th><th>Last updated</th></tr>"

		for(var hostname in systems){
			var cpuLoadAverage = systems[hostname]["cpuLoadAverage"];
			var numberOfProcessors = systems[hostname]["numberOfProcessors"];
			var time = systems[hostname]["time"];
			
			html += "<tr><td>" + hostname + "</td><td>" + cpuLoadAverage + "</td><td>" + numberOfProcessors + "</td><td>" + time + "</tr>"
		}

		html += "</table></body></html>"
		
		response.write(html)
		response.end()
	}



}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})