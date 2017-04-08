# system-monitor
Centralised monitoring of remote systems

## Usage
### Setting up your server
Your server both collects your data and renders it for analysis.

#### Requirements
 * Node 6

#### Start server
```
node server.js
```

### Setting up your agents
Agents collect system data and send it to the centralization server.

#### Requirements
Written in bash and avoiding any funny tools to run in as many environments as possible.

#### Start agent
./watcher.js {{ centralization_server }} {{ polling_interval }}

where,
 * `centralization_server` (IP or URL) - the endpoint of your centralization server
 * `polling_interval` (integer) - the time between calls home to update the centralization server
