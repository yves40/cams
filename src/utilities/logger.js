//----------------------------------------------------------------------------
//    logger.js
//
//    Mar 05 2019   Initial (Toulouse ENAC)
//    Mar 06 2019   Add log level to the trace
//----------------------------------------------------------------------------
const Version = 'logger:1.12, Mar 06 2019';

const fs = require('fs'); 

const MAXLOGS = 10;
const months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
let logs = [];

const DEBUG = 0;
const INFORMATIONAL = 1;
const WARNING = 2;
const ERROR = 3;
const FATAL = 4;
const LOGMODE = process.env.LOGMODE || DEBUG;
let OUTFILE = process.env.LOGFILE || '/tmp/jslogger.log'
let tracetofileflag = false;
let tracetoconsoleflag = true;

module.exports.DEBUG = DEBUG;
module.exports.INFORMATIONAL = INFORMATIONAL;
module.exports.WARNING = WARNING;
module.exports.ERROR = ERROR;
module.exports.FATAL = FATAL;

function levelToString(level) {
    switch (level) {
        case DEBUG: return 'DBG';
        case INFORMATIONAL: return 'INF';
        case WARNING: return 'WRN';
        case ERROR: return 'ERR';
        case FATAL: return 'FTL';
        default: return 'FTL';
    }
}

function log(mess, level) {
    if (level >= LOGMODE) {
        let d = new Date();
        if (logs.length === MAXLOGS) {
            logs.shift();                   // Handle the log buffer
        }
        let logstring = months[d.getMonth()] + '-' + d.getDate() + '-' + d.getFullYear() + ' ' 
                + d.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1") 
                + ' [' + levelToString(level) + '] '
                + ' ' + mess ;
        logs.push( logstring);
        if (tracetoconsoleflag)
            console.log(logstring);
        // trace to a file ?
        if (tracetofileflag) {
            fs.appendFile(OUTFILE,logstring + '\n', 'utf8', function(err) {
                if (err) {
                    throw 'Error opening the trace file. Set LOGFILE environment variable to the desired location';
                }
            });
        }
    }
    return;
}

module.exports.enableconsole = function enableconsole() {
    tracetoconsoleflag = true;
}

module.exports.disableconsole = function disableconsole() {
    if (tracetofileflag)            // If no trace set to file, do not disable the console
        tracetoconsoleflag = false;
}

module.exports.tracetofile = function tracetofile(filename = OUTFILE) {
    tracetofileflag = true;
    OUTFILE = filename;
}
module.exports.debug = function debug(mess) {
    log(mess, DEBUG);
    return;
}
module.exports.info = function info(mess) {
    log(mess, INFORMATIONAL);
    return;
}
module.exports.warning = function warning(mess) {
    log(mess, WARNING);
    return;
}
module.exports.error = function error(mess) {
    log(mess, ERROR);
    return;
}
module.exports.fatal = function fatal(mess) {
    log(mess, FATAL);
    return;
}
