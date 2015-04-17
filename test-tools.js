/**
 * This method starts the load test for the Lynx
 * statsd client. In this method we'll max out the number
 * of UDP requests sent to the statsd client.
 * @param {Object}      options     Options object containing depth, timeout and runTime properties.
 * @param {Function}    callback    The function which will execute every interval.
 */
function loadTest( callback, options ) {
    console.log( new Date().toUTCString(), "Starting load test for " + options.depth + " instances running every " +
    ( options.timeout/1000 ) + " seconds. Runtime: " + ( options.runTime/60/1000 ) + " minutes.");

    for( var i = 0; i < options.depth; i++ ) {
        setInterval( function() {
            callback();
        }, options.timeout );
    }

    setTimeout( function() {
        console.log( new Date().toUTCString(), "Test finished." );
        process.exit();
    }, options.runTime );
}

module.exports = {
    loadTest: loadTest
};