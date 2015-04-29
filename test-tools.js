// Internal counter to compare expected load versus actual load
var metricsSent = 0;

/**
 * This function starts the load test.
 * @param {Object}      options     Options obtained by the CLI.
 * @param {Function}    callback    The function which will send a metric to statsd.
 */
function loadTest( callback, options ) {
    console.log( new Date().toUTCString(), "Starting load test for " + options.depth + " instances running every " +
    ( options.timeout/1000 ) + " seconds. Runtime: " + ( options.runTime/60/1000 ) + " minutes.");

    for( var i = 0; i < options.depth; i++ ) {
        setInterval( function() {
            callback();
            metricsSent++;
        }, options.timeout );
    }

    setTimeout( function() {
        var setLoadPerSecond = options.depth * ( 1000 / options.timeout );
        var actualLoadPerSecond = metricsSent / (options.runTime / 1000);
        var difference = 100 - ( 100 * ( actualLoadPerSecond / setLoadPerSecond ) );
        console.log( new Date().toUTCString(), "Test finished, sent " + metricsSent + " metrics. Expected load:" +
        setLoadPerSecond +"/s. Actual load: " + actualLoadPerSecond + "/s. Difference: " + difference +"%" );
        process.exit();
    }, options.runTime );
}

/**
 * This function starts a stress test. This test will
 * fire the callback every 'options.timeout' ms. When set to 0
 * it will be in the form of while(true) { callback() }.
 * @param {Function}    callback    The function which will send a metric to statsd
 * @param {Object}      options     Options obtained by the CLI.
 */
function stressTest( callback, options ) {
    var end = new Date().getTime() + options.runTime;
    setTimeout(function () {
        for( var i = 0; i < options.depth; i++ ) {
            callback();
        }
        if (end < new Date().getTime()) {
            console.log(new Date().toUTCString(), "Test finished.");
            process.exit();
        } else {
            stressTest( callback, options );
        }
    }, options.timeout);
}

/**
 * This function executes a test based on the option given by the CLI.
 * @param {Function}    callback    The function which sends a metric to statsd.
 * @param {Object}      options     Options obtained by the CLI.
 */
function executeTest( callback, options ) {
    switch( options.e ) {
        case 'load':
            console.log( new Date().toUTCString(), "Starting load test for " + options.library + " library." );
            loadTest( callback, options );
            break;
        case 'stress':
            console.log( new Date().toUTCString(), "Starting stress test for " + options.library + " library." );
            console.log( new Date().toUTCString(), "Starting stress test with timeout of " + options.timeout + "ms and " +
             options.depth +" instances. Runtime: " + ( options.runTime/60/1000 ) + " minutes.");
            stressTest( callback, options );
            break;
        default:
            console.log( new Date().toUTCString(), "No test defined, using default (load test). " +
            "Starting load test for " + options.library + " library." );
            loadTest( callback, options );
    }
}

module.exports = {
    executeTest: executeTest
};