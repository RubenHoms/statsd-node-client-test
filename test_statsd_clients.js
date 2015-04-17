// Require all the libraries we will be using for testing
var testTools = require("./test-tools");
var argv = require('minimist')(process.argv.slice(2));
var lynx = require('lynx'); // https://github.com/dscape/lynx
var Client = require('node-statsd-client').Client; // https://github.com/spreaker/nodejs-statsd-client
var SDC = require('statsd-client'); // https://github.com/msiebuhr/node-statsd-client
var StatsD = require('node-statsd'); // https://github.com/sivy/node-statsd

// Read options for initiating the load test or use defaults.
// Depth = number of instances to be spawned (default 1000)
// timeout = timeout for each instance (default 1000ms)
// runTime = Time to run the test (default 15*60*1000 ms)
// host = StatsD host address. (default 'localhost')
// port = StatsD port. (default 8125)
// test = Test to execute, either ´load' or 'stress' (default 'load')
// library = Library to test (default 'lynx')
var options = {};
options.depth = argv.d ? argv.d : 1000;
options.timeout = argv.t || argv.t == 0 ? argv.t : 1000;
options.runTime = argv.r ? argv.r : ( 15*60*1000 );
options.host = argv.h ? argv.h : 'localhost';
options.port = argv.p ? argv.p : 8125;
options.e = argv.e ? argv.e : 'load';
options.library = argv.l ? argv.l : 'lynx';

// Setup the various libraries
var metricsLynx = new lynx( options.host, options.port, { prefix:'lynx_test', on_error: function( err ) {
    console.log( "Error (lynx):", err, err.message );
} } );

var metricsClient = new Client( options.host, options.port );

var metricsSDC = new SDC( {
    host: options.host,
    port: options.port,
    prefix: 'sdc_test'
} );

var metricsStatsD = new StatsD({
    host: options.host,
    port: options.port,
    prefix: 'node_statsd_test'
});

// Read command line arguments to determine what library to test
switch( argv.l ) {
    case 'lynx':
        testTools.executeTest( function() {
            metricsLynx.set( 'stress_test', Math.floor( Math.random() * 100 ) + 1 );
        }, options );
        break;
    case 'node-statsd-client':
        testTools.executeTest( function() {
            metricsClient.gauge( 'client_test.stress_test', Math.floor( Math.random() * 100 ) + 1 );
        }, options );
        break;
    case 'statsd-client':
        testTools.executeTest( function() {
            metricsSDC.set( 'stress_test', Math.floor( Math.random() * 100 ) + 1 );
        }, options );
        break;
    case 'node-statsd':
        testTools.executeTest( function() {
            metricsStatsD.set( 'stress_test', Math.floor( Math.random() * 100 ) + 1 );
        }, options );
        break;
    default:
        console.log("Error: Specify the library to perform the load test on with '-l <name-of-library'. " +
        "Possible options: lynx, node-statsd-client, statsd-client, node-statsd");
}