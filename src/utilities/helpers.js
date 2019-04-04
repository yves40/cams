//----------------------------------------------------------------------------
//    helpers.js
//
//    Mar 13 2019   Initial
//    Mar 14 2019   Function name
//    Mar 17 2019   Add some functions.
//    Mar 18 2019   Add some functions..
//    Mar 27 2019   Sleep, and add a getDate()
//    Mar 30 2019   Cannot read property of undefined
//    Apr 03 2019   Test for error : Cannot read property of undefined
//    Apr 04 2019   Get IP from a request
//----------------------------------------------------------------------------
const Version = "helpers:1.20, Apr 04 2019 ";

const months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

module.exports.getDateTime = function getDateTime() {
    let d = new Date();
    let datetime = months[d.getMonth()] + '-' + d.getDate() + '-' + d.getFullYear() + ' ' 
    + d.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1"); 
    return datetime;
}

module.exports.getDate = function getDate() {
    let d = new Date();
    let datetime = months[d.getMonth()] + '-' + d.getDate() + '-' + d.getFullYear() + ' ';
    return datetime;
}

module.exports.getTime = function getTime() {
    let d = new Date();
    let time = d.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1"); 
    return time;
}

module.exports.getHoursMinutes = function getHoursMinutes() {
    let d = new Date();
    let time = d.getHours() + ':' + d.getMinutes();
    return time;
}

module.exports.getHoursMinutesSeconds = function getHoursMinutesSeconds() {
    let d = new Date();
    return d.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
}

module.exports.convertDateTime = function convertDateTime(thedate) {
    computedate = new Date(thedate);
    datetime = months[computedate.getMonth()] + '-' + computedate.getDate() + '-' 
    + computedate.getFullYear() + ' ' 
    + computedate.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1"); 
    return datetime;
}

module.exports.convertSecondsToHMS = function convertSecondsToHMS(seconds) {
    let computedate = new Date(1970,0,1);
    computedate.setSeconds(seconds);
    return computedate.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");    
}

//----------------------------------------------------------------------------
// Super sleep function ;-)
// Must be called from an ASYNC function
//----------------------------------------------------------------------------
module.exports.sleep = function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//----------------------------------------------------------------------------
// Get IP from a request
//----------------------------------------------------------------------------
module.exports.getIP = function getIP(req) {
    var ip = req.headers['x-forwarded-for'] || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
    return ip.replace(/f/gi, '').replace(/:/gi, '');
}
