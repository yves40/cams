//----------------------------------------------------------------------------
//    auth.js
//
//    Jan 30 2019    Initial
//    Jan 31 2019    Get userController code 
//    Mar 06 2019    console.log replaced by logger
//----------------------------------------------------------------------------
const Version = 'auth.js:1.09, Mar 06 2019 ';

const jwtconfig = require('./utilities/jwtconfig');
const logger = require('./utilities/logger');
const User = require('./models/userModel');

const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
jwtOptions.secretOrKey = jwtconfig.jwtSecret;


logger.disableconsole();
logger.tracetofile('/tmp/webapp.log')

//-----------------------------------------------------------------------------------
// Sign a token
//-----------------------------------------------------------------------------------
module.exports.signToken = function signToken(payload) {
    logger.debug(Version + 'signing the token with a 3h expiration time');
    const token = jwt.sign(payload, jwtOptions.secretOrKey, {expiresIn: 10800}); // 3 hours
    return token;
};

//-----------------------------------------------------------------------------------
// passport initialization stuff
// jwt strategy
// This verifies that the token sent by the user is valid
//-----------------------------------------------------------------------------------
passport.use('jwt', new JwtStrategy(jwtOptions,
    (token, done) => {
        try {
            return done(null, token);
        }
        catch(error) {
            done(error);
        }
    }
));
//-----------------------------------------------------------------------------------
// passport initialization stuff
// Local strategy for user  / password authentication
// Accounts stored in mongo
//-----------------------------------------------------------------------------------
passport.use('login',  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    }, 
    (email, password, done) => {
        User.getUserByEmail(email, (err, loggeduser) => {
            if(err) { return done(err); }
            if ( !loggeduser ) { return done(null, false, {message: 'Unknown User'}) }  // Error
            User.comparePassword(password, loggeduser.password, (error, isMatch ) => {
                if (isMatch) {
                    logger.debug(Version + email + ' identified');
                    return done(null, loggeduser)   // Success login !!!
                }
                return done( null, false, {message: 'Wrong password'} ); // Error
            });
        });
    }
));

//-----------------------------------------------------------------------------------
// Utility routines for passport
//-----------------------------------------------------------------------------------
passport.serializeUser((loggeduser, done) => {
    logger.debug(Version + 'serializeUser with mail : ' + loggeduser.email);
    done(null, loggeduser.id);
});

passport.deserializeUser((id, done) => { 
    logger.debug(Version + 'deserializeUser with ID : ' + id);
    User.findById(id, (err, loggeduser) => {
        done(err, loggeduser);
    });
});


