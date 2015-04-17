# CLI load test suite for statsd node clients
I wrote this project in order to test the performance of multiple node.js clients 
for [statsd](https://github.com/etsy/statsd/). I wanted to find out the performance differences between
the available node.js clients for statsd so I made this CLI tool which makes it easy to switch options for each test.
It basically performs a load test based on the input from the CLI.

The clients that are currently supported are:

* [lynx](https://github.com/dscape/lynx)
* [node-statsd-client](https://github.com/msiebuhr/node-statsd-client)
* [node-statsd](https://github.com/sivy/node-statsd)
* [statsd-client](https://github.com/msiebuhr/node-statsd-client)

You can run this test suite by cloning this project and running it like this:

```
node test_statsd_client.js -l <library> -d <number of workers> -t <timeout>
```

For example you can test lynx by running:

```
node test_statsd_client.js -l lynx -d 10000 -t 1000
```

This will spawn 10.000 intervals through [`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval)
which will fire every 1000ms.

There are multiple options which can be overridden through the command line. The options are as follows:

```
-d <number>     Number of setIntervals to spawn. (default depth = 1000)
-t <number>     Timeout for the interval (default timeout = 1000)
-r <number>     The time to run the tests for. (default runtime = 15*60*1000 --> 15 minutes)
-h <string>     The host statsd is running on. (default host = localhost)
-p <number>     The port statsd is running on. (default port = 8125)
```