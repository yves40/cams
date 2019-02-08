//----------------------------------------------------------------------------
//    jwtconfig.js
//
//    Nov 25 2018   Initial
//    Dec 04 2018   Add mongo DB params
//    Dec 08 2018   TWITTER login, start of work
//    Dec 09 2018   GOOGLE and LINKEDIN, prepare future ;-)
//    Dec 31 2018   Clean up
//    Jan 21 2019   NODESECRET
//    Feb 06 2019   Switch mongo schema to cams
//----------------------------------------------------------------------------
const Version = 'jwtconfig:1.06, Feb 062019';

module.exports = {  
    jwtSecret: process.env.NODESECRET || 'thisisthesecretkey' ,
    jwtSession: {
        session: false
    },
    mongodb: 'mongodb://localhost:4100/cams',
    TWITTER_APP_ID: '',
    TWITTER_APP_SECRET: '',
    TWITTER_CALLBACK: '',
    GOOGLE_APP_ID: '',
    GOOGLE_APP_SECRET: '',
    GOOGLE_CALLBACK: '',
    LINKEDIN_APP_ID: '',
    LINKEDIN_APP_SECRET: '',
    LINKEDIN_CALLBACK: '',
};
