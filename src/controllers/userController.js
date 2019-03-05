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
//    Jan 23 2019   Some cleanup
//    Jan 25 2019   passwort jwt is back
//    Jan 26 2019   Some readings about jwt an passport drives to more tests
//                  Add a find user ByID a d by email services
//    Jan 30 2019   Small change in a log message
//    Jan 31 2019   Code reorg, now use a separate file auth.js for JWT stuff
//    Feb 01 2019   Cleanup
//                  Extract CORS to cors.js
//    Feb 06 2019   current_user, reorder the log 
//    Feb 08 2019   user description
//    Feb 11 2019  current_user now sends back the mongo status
//----------------------------------------------------------------------------

const Version = 'userController: 2.45, Feb 11 2019 ';

// Enable JWT
const auth = require('../auth');
// CORS
const corsutility = require("../../config/corsutility");
// User definition
const User = require('../models/userModel')
// To access mongodb status
const mongo = require("../utilities/mongo");

const passport = require('passport');
const cors = require('cors');

module.exports.controller = (app) => {

    //-----------------------------------------------------------------------------------
    // login a user : local strategy
    //-----------------------------------------------------------------------------------
    app.post('/users/login', cors(corsutility.getCORS()),passport.authenticate('login'), (req, res) => {
        const payload = { id: req.user.id, email: req.user.email };
        const token = auth.signToken(payload);
        console.log(Version + 'User ' + req.user.email + ' logged');
        res.json( { message: req.user.email + ' logged', token });
    });

    //-----------------------------------------------------------------------------------
    // get current user
    //-----------------------------------------------------------------------------------
    app.get('/users/current_user', cors(corsutility.getCORS()), passport.authenticate('jwt'), (req, res) => {
        if (req.user) {
            console.log(Version + '/users/current_user callback for ' + req.user.email);
            mongostatus = mongo.getMongoDBStatus();
            res.json( {current_user: req.user, mongostatus: mongostatus} );
        }
    }); 

    //-----------------------------------------------------------------------------------
    // logout a user
    //-----------------------------------------------------------------------------------
    app.post('/users/logout', cors(corsutility.getCORS()), passport.authenticate('jwt'), (req, res) => {
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
    app.get('/users/list', cors(corsutility.getCORS()), (req, res) => {
        User.listUsers( (error, userlist) => {
            if(error) { console.log(error);}
            console.log(Version + "Fetched " + userlist.length + " users"); 
            res.send(userlist);   
        })
    });

    //-----------------------------------------------------------------------------------
    // Register user
    //-----------------------------------------------------------------------------------
    app.post('/users/register', cors(corsutility.getCORS()), (req, res) => {

        User.getUserByEmail(req.body.email, (err, loggeduser) => {
            if(err) { return done(err); }
            if ( !loggeduser ) { 
                const name = req.body.name;
                const email = req.body.email;
                const password = req.body.password;
                const description = req.body.description;
                const newuser = new User({name, email, password, profilecode: 0, description});
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
    app.post('/users/registers', cors(corsutility.getCORS()), (req, res) => {
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
    // Find a user by ID
    //-----------------------------------------------------------------------------------
    app.get('/users/find/ID/:id', cors(corsutility.getCORS()), (req, res) => {
        console.log(Version + 'Search user with ID : ' + req.params.id);
        User.findById( req.params.id, (error, user) => {
            if(error) { 
                console.log(error); 
                res.send( { message: 'No user matching this ID :' + req.params.id });
            }
            res.send(user);
        });
    })
    //-----------------------------------------------------------------------------------
    // Find a user by mail
    //-----------------------------------------------------------------------------------
    app.get('/users/find/email/:email', cors(corsutility.getCORS()), (req, res) => {
        console.log(Version + 'Search user with mail : ' + req.params.email);
        User.findOne({ 'email': req.params.email },  (error, user) => {
            if(error) { 
                console.log(error); 
                res.send( { message: 'No user matching this email :' + req.params.email });
            }
            res.send(user);
        });
    })
    //-----------------------------------------------------------------------------------
    // Remove One user by ID
    //-----------------------------------------------------------------------------------
    app.post('/users/delete/ID/:id', cors(corsutility.getCORS()), (req, res) => {
        console.log(Version + 'Removing user with ID : ' + req.params.id);
        User.deleteoneUserByID( req.params.id, (error, deleted) => {
            if(error) { console.log(error); }
            if(deleted.result.n === 0) { 
                console.log('No user matching this ID :' + req.params.id);
                res.send( { message: 'No user matching this ID :' + req.params.id });
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
    app.post('/users/delete/name/:name', cors(corsutility.getCORS()), (req, res) => {
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
    app.post('/users/deleteall', cors(corsutility.getCORS()), (req, res) => {
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
