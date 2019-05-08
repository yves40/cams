//----------------------------------------------------------------------------
//    user.js
//
//    Apr 24 2019   Initial
//    Apr 26 2019   Some work on methods
//    May 07 2019   Update Message
//    May 08 2019   WIP on async 
//----------------------------------------------------------------------------

const User = require('../models/userModel');
const bcryptjs = require('bcryptjs');

module.exports = class user {
    constructor (usermail = "dummy@free.fr") {
        this.Version = 'user:1.23, May 08 2019 ';
        this.User = new(User);
        this.User.email = usermail;
    };

    // Setters & getters
    getVersion() { return this.Version; }
    getemail() {return this.User.email;}
    setname(name) { this.User.name = name; }
    getname() { return this.User.name; }
    setemail(email) { this.User.email = email; }
    getemail() { return this.User.email; }
    setpassword(password) { this.User.password =  hashPassword(password);;}
    getpassword() { return this.User.password; }
    setprofilecode(profilecode) { this.User.profilecode = profilecode;  }
    getprofilecode() { return this.User.profilecode; }
    setdescription(description) { this.User.description = description;  }
    getdescription() { return this.User.description; }   

    //-------------------------------------
    // Get a user object and save it
    //-------------------------------------
    createUser(user) {
        return new Promise( (resolve, reject) => {
            this.User.email = user.email;
            this.User.name = user.name;
            this.User.password = hashPassword(user.password);
            this.User.profilecode = user.profilecode;
            this.User.description = user.description;
            (async () => {
                save(this);
                resolve('User ' + user.email + ' created');
            })();
        })
    }
    //-------------------------------------
    // Get a user object and update it
    //-------------------------------------
    updateUser(user) {
        return new Promise((resolve, reject) => {
            this.User.email = user.email;
            this.User.name = user.name;
            this.User.password = hashPassword(user.password);
            this.User.profilecode = user.profilecode;
            this.User.description = user.description;
            User.findOneAndUpdate( {email: this.User.email}, 
                {
                    email: this.User.email,
                    name: this.User.name,
                    password: this.User.password,
                    profilecode: this.User.profilecode,
                    description: this.User.description,
                },
                { upsert: false, new: true },
                (err, userupdated) => {
                    if (err) reject(err);
                    else{
                        if(userupdated === null) {
                            resolve('User ' + this.User.email + ' does not exist');
                        }
                        else {
                            resolve('User ' + userupdated.email + ' updated');
                        }
                    }
                }
            );
        })
    }
    //-------------------------------------
    // Remove this user
    //-------------------------------------
    removeUser() {
        return new Promise((resolve, reject) => {
            (async () => {
                User.findOneAndRemove( {email: this.User.email},
                    (err, userupdated) => {
                        if (err) reject(err);
                        else resolve('User ' + this.User.email + ' deleted');
                    });
            })();                
        });
    }
    //-------------------------------------
    // List user(s)
    //-------------------------------------
    listUser() {
        return new Promise((resolve, reject) => {
            let querylog = User.find({});
            (async () => {
                await querylog.exec(function(err, userlist) {
                    if (err) console.log(err);
                    if(userlist.length === 0) {
                        reject({});
                    }
                    else {
                        resolve(userlist);
                    }
                });
            })();
        });
    }
}
//----------------------------------------------------------------------------
// Private 
// Beware, these functions don't  have access to 'this'
//----------------------------------------------------------------------------
function hashPassword(password) {
    let salt = bcryptjs.genSaltSync(10);
    let hash = bcryptjs.hashSync(password, salt);
    return hash;
}
function save(theobject) {
    theobject.User.save();
}
function update(theobject) {
    User.findOneAndUpdate( {email: theobject.User.email}, 
            {
                email: theobject.User.email,
                name: theobject.User.name,
                password: theobject.User.password,
                profilecode: theobject.User.profilecode,
                description: theobject.User.description,
            },
        (err, userupdated) => {
            if (err) console.log(err);
        });
}
function remove(usermail) {
    User.findOneAndRemove( {email: usermail},
        (err, userupdated) => {
            if (err) console.log(err);
        });
}
//----------------------------------------------------------------------------
// Super sleep function ;-)
// Must be called from an ASYNC function
//----------------------------------------------------------------------------
sleep = function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
