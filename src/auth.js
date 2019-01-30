//----------------------------------------------------------------------------
//    bus.js
//
//    Jan 30 2019    Initial
//----------------------------------------------------------------------------
const Version = 'auth.js 1.00, Jan 30 2019 ';

const jwtconfig = require('../config/jwtconfig');

const JWTstrategy = require('passport-jwt').Strategy;
//We use this to extract the JWT sent by the user
const ExtractJWT = require('passport-jwt').ExtractJwt;

//This verifies that the token sent by the user is valid
passport.use(new JWTstrategy({
    //secret we used to sign our JWT
    secretOrKey : jwtconfig.jwtSecret,
    //we expect the user to send the token as a query paramater with the name 'secret_token'
    jwtFromRequest : ExtractJWT.fromUrlQueryParameter('secret_token')
    }, async (token, done) => {
    try {
        //Pass the user details to the next middleware
        return done(null, token.user);
    } catch (error) {
        done(error);
    }
}));
