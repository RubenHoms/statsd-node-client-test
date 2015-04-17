/**
 * This method starts the load test for the Lynx
 * statsd client. In this method we'll max out the number
 * of UDP requests sent to the statsd client.
 * @param {Object}      options     Options object containing depth, timeout and runTime properties.
 * @param {Function}    callback    The function which will execute every interval.
 */
function loadTest( callback, options ) {
    console.log( new Date().toUTCString(), "Starting load test for " + options.depth + " instances running every " +
    (options.timeout/1000) + " seconds. Runtime: " + (options.runTime/60/1000) + " minutes.");
    var start = new Date().getTime();
    var intervals = [];

    for( var i = 0; i < options.depth; i++ ) {
        intervals.push( setInterval( function() {
            callback();
        }, options.timeout ) );
    }

    cleanup( start, options.runTime, intervals );
}

/**
 * This method cleans up all intervals after the specified
 * runtime has expired.
 * @param {Number}  start       The start date (Unix timestamp)
 * @param {Number}  runTime     The amount of ms the intervals should run.
 * @param {Array}   intervals   The intervals to cancel once the runtime is up.
 */
function cleanup( start, runTime, intervals ) {
    console.log( new Date().toUTCString(), "Setting up cleanup timers" );
    var end = start + runTime;
    var check = setInterval( function() {
        if( new Date().getTime() > end ) {
            intervals.push( check );
            cleanupIntervals( intervals );
        }
    }, 100 );
}

function cleanupIntervals( intervals ) {
    for( var i = 0; i < intervals.length; i ++ ) {
        clearInterval( intervals[i] );
    }
    console.log( new Date().toUTCString(), "Done cleaning up intervals." );
}

module.exports = {
    loadTest: loadTest,
    cleanup: cleanup,
    cleanupIntervals: cleanupIntervals
};