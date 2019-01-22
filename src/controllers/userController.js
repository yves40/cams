//----------------------------------------------------------------------------
//    userController.js
//
//    Nov 10 2018   Initial
//    Nov 11 2018   Test the service
//    Nov 21 2018   Test a personalized error message on user registration
//                  Add the API endpoint to log a user in
//    Nov 26 2018   Add user email in jwt payload
//    Nov 27 2018   WIP on user payload in the JWT payload
//    Dec 01 2018   Add expiration time when signing the token
//    Dec 03 2018   Add a local user strategy
//    Dec 04 2018   Local user strategy
//    Dec 05 2018   Debugging user session
//    Dec 06 2018   Debugging user session...
//    Dec 07 2018   Problem with mono node config and CORS
//    Dec 08 2018   TWITTER login, start of work
//    Dec 09 2018   TWITTER login, work..
//                  Will work on that later. No internet address available
//                  for my super vboxweb server
//    Jan 17 2019   Transfered to the CAMS project
//    Jan 19 2019   Some CORS tests, but not selected
//    Jan 20 2019   Start adding session management
//    Jan 21 2019   CORS is still very mysterious to me
//    Jan 22 2019   Passport : API problem solved
//                  When registering a user, check he's not aleady registered
//                  Add top bar management, fix problem with invalid login
//----------------------------------------------------------------------------

const Version = 'userController.js 2.04, Jan 22 2019 ';

const User = require('../models/userModel');
const jwtconfig = require('../../config/jwtconfig');
const myenv = require("../../config/myenv");

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const ExtractJwt = passportJWT.ExtractJwt;
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
jwtOptions.secretOrKey = jwtconfig.jwtSecret;

module.exports.controller = (app) => {

    //-----------------------------------------------------------------------------------
    // passport initialization stuff
    // Local strategy
    //-----------------------------------------------------------------------------------
    passport.use( new LocalStrategy( {
        usernameField: 'email',
        passwordField: 'password',
        failureFlash: true,
        passReqToCallback : true,
    }, (req, email, password, done) => {
        User.getUserByEmail(email, (err, loggeduser) => {
            if(err) { return done(null, false, {message: 'Bad login'}); }
            if ( !loggeduser ) { return done(null, false, {message: 'Unknown User'}) }  // Error
            User.comparePassword(password, loggeduser.password, (error, isMatch ) => {
                if (isMatch) {
                    console.log(Version + email + ' identified');
                    return done(null, loggeduser)   // Success login !!!
                }
                return done( null, false, {message: 'Wrong password'} ); // Error
            });
            return true;
        });
    }));

    passport.serializeUser((loggeduser, done) => {
        console.log(Version + 'serializeUser with mail : ' + loggeduser.email);
        done(null, loggeduser.id);
    });

    passport.deserializeUser((id, done) => { 
        console.log(Version + 'deserializeUser with ID : ' + id);
        User.findById(id, (err, loggeduser) => {
            done(err, loggeduser);
        });
    });


    //-----------------------------------------------------------------------------------
    // get current user
    //-----------------------------------------------------------------------------------
    app.get('/users/current_user', cors(myenv.getCORS()), (req, res) => {
        if (req.user) {
            res.json( {current_user: req.user} );
        }
        else {
            res.json({ current_user: 'anonymous' });
        }
    }); 

    //-----------------------------------------------------------------------------------
    // login a user
    //-----------------------------------------------------------------------------------
    app.post('/users/login', cors(myenv.getCORS()), passport.authenticate('local',
                         { failureRedirect: '/users/login', failureFlash: false, }), 
                    (req, res) => {
        const payload = { id: req.user.id, email: req.user.email };
        console.log(Version + 'signing the token with a 24h expiration time');
        const token = jwt.sign(payload, jwtOptions.secretOrKey, {expiresIn: 86400}); // 24 hours
        console.log(Version + 'User ' + req.user.email + ' logged');
        res.json( { message: req.user.email + ' logged', token });
    });

    //-----------------------------------------------------------------------------------
    // logout a user
    //-----------------------------------------------------------------------------------
    app.get('/users/logout', cors(myenv.getCORS()), (req, res) => {
        if (req.user) {
            console.log(Version + 'logging ' + req.user.email +  ' out');
            const useremail = req.user.email;
            req.logout();
            const message = useremail + ' logged out';
            res.json( { message: this.message });
        }
        else {
            res.json( { message: 'Not logged '});
        }
    });

    //-----------------------------------------------------------------------------------
    // List all users
    //-----------------------------------------------------------------------------------
    app.get('/users/list', cors(myenv.getCORS()), (req, res) => {
        User.listUsers( (error, userlist) => {
            if(error) { console.log(error);}
            console.log(Version + "Fetched " + userlist.length + " users"); 
            res.send(userlist);   
        })
    });

    //-----------------------------------------------------------------------------------
    // Register user
    //-----------------------------------------------------------------------------------
    app.post('/users/register', cors(myenv.getCORS()), (req, res) => {

        User.getUserByEmail(req.body.email, (err, loggeduser) => {
            if(err) { return done(err); }
            if ( !loggeduser ) { 
                const name = req.body.name;
                const email = req.body.email;
                const password = req.body.password;
                const newuser = new User({name, email, password, profilecode: 0});
                User.createUser(newuser, (error, user) => {
                    if(error) { 
                        res.status(422).json({
                            message: 'Something went wrong, try again later',
                        });
                    }
                    console.log(Version + 'Added '+ user.email + ' with password ' + user.password);
                    res.send({
                        user: user, 
                        message: 'User ' + user.email + ' registered',
                        status: 'OK',
                    });
                });
            }
            else {
                console.log(Version + 'User ' + req.body.email + ' already registered');
                res.send({
                    user: null, 
                    message: 'User ' + req.body.email + ' already registered',
                    status: 'KO',
                });
        }
        });

    });
    //-----------------------------------------------------------------------------------
    // Register users
    //-----------------------------------------------------------------------------------
    app.post('/users/registers', cors(myenv.getCORS()), (req, res) => {
        console.log(Version + 'Adding users');
        let allusers = {};
        allusers = req.body.allusers;
        console.log(Version + 'Received a package for ' + allusers.length + ' users.');
        allusers.forEach((oneuser) => {
            let name = oneuser.name;
            let email = oneuser.email;
            let password = oneuser.password;
            let newuser = new user({name,email,password});
            user.createUser(newuser, (error, user) => {
                if(error) { console.log(error) };
                console.log(Version + 'Added '+ user.email + ' with password ' + user.password);
            });
        });
        res.send('success');
    });
    //-----------------------------------------------------------------------------------
    // Remove One user by ID
    //-----------------------------------------------------------------------------------
    app.post('/users/delete/ID/:id', cors(myenv.getCORS()), (req, res) => {
        console.log(Version + 'Removing user with ID : ' + req.params.id);
        User.deleteoneUserByID( req.params.id, (error, deleted) => {
            if(error) { console.log(error); }
            if(deleted.result.n === 0) { 
                console.log('No user matching this ID :' + req.params.id);
            }
            else{
                console.log(Version + ' Done.' );
            }
            res.send(deleted);
        });
    })
    //-----------------------------------------------------------------------------------
    // Remove One user by name
    //-----------------------------------------------------------------------------------
    app.post('/users/delete/name/:name', cors(myenv.getCORS()), (req, res) => {
        console.log(Version + 'Removing user with name : ' + req.params.name);
        User.deleteoneUserByName( req.params.name, (error, deleted) => {
            if(error) { console.log(error); }
            if(deleted.result.n === 0) { 
                console.log('No user matching this name :' + req.params.name);
            }
            else{
                console.log(Version + ' Done.' );
            }
            res.send(deleted);
        });
    })
    //-----------------------------------------------------------------------------------
    // Remove all users
    //-----------------------------------------------------------------------------------
    app.post('/users/deleteall', cors(myenv.getCORS()), (req, res) => {
        console.log(Version + 'Deleting all users !!!');
        User.deleteallUsers( () => {
            console.log(Version + ' done !!');
            res.send('success');
        });
    })
    //-----------------------------------------------------------------------------------
    // Version
    //-----------------------------------------------------------------------------------
    module.exports.getVersion =  () => { return Version; }
};
