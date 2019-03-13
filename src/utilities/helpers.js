//----------------------------------------------------------------------------
//    helpers.js
//
//    Mar 13 2019   Initial
//----------------------------------------------------------------------------
const Version = "helpers:1.02, Mar 13 2019 ";

const months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

module.exports.getDateTime = function getFullDate() {
    let d = new Date();
    datetime = months[d.getMonth()] + '-' + d.getDate() + '-' + d.getFullYear() + ' ' 
    + d.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1"); 
    return datetime;
};

module.exports.getTime = function getTime() {
    let d = new Date();
    time = d.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1"); 
    return time;
};

module.exports.getHoursMinutes = function getHoursMinutes() {
    let d = new Date();
    time = d.getHours() + ':' + d.getMinutes();
    return time;
};
