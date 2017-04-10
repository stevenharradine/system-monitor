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
			var time = payload.time

			systems[hostname] = {}
			systems[hostname]['cpuLoadAverage'] = cpuLoadAverage
			systems[hostname]['numberOfProcessors'] = numberOfProcessors
			systems[hostname]['memoryTotal'] = memoryTotal
			systems[hostname]['memoryUsed'] = memoryUsed

			systems[hostname]['partitions'] = payload.partitions

			systems[hostname]['time'] = time

			response.write("Accepted")
		} catch (e) {
			response.write("Error: " + e)
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
		} else if (request.url == "/gauge.min.js") {
			fs.readFile('gauge.min.js', 'utf8', function (err,data) {
				if (err) {
					return console.log(err);
				}
				response.write(data)
				response.end()
			});
		} else if (request.url == "/data.json") {
			try {
				console.log (JSON.stringify (systems))
				response.write(JSON.stringify (systems))
			} catch (e) {
				response.write(e)
			}
			response.end()
		} else {
			var html = ""
			
			html += "<html><head>"
			html += "<title>System Monitor</title>"
			html += "<link rel='stylesheet' type='text/css' href='styles.css'>"
			html += "<script src='gauge.min.js'></script>"
			html += "<body>"
			html += "<div id='table'></div><script src='functionality.js' type='text/javascript'></script></body></html>"

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
