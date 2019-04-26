//----------------------------------------------------------------------------
//    user.js
//
//    Apr 24 2019   Initial
//    Apr 26 2019   Some work on methods
//----------------------------------------------------------------------------

const User = require('../models/userModel');
const bcryptjs = require('bcryptjs');

module.exports = class user {
    constructor (usermail = "dummy@free.fr") {
        this.Version = 'user:1.18, Apr 26 2019 ';
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
    // Get a user object and save it
    createUser(user) {
        this.User.email = user.email;
        this.User.name = user.name;
        this.User.password = hashPassword(user.password);
        this.User.profilecode = user.profilecode;
        this.User.description = user.description;
        save(this);
    }
    // Get a user object and update it
    updateUser(user) {
        this.User.email = user.email;
        this.User.name = user.name;
        this.User.password = hashPassword(user.password);
        this.User.profilecode = user.profilecode;
        this.User.description = user.description;
        update(this);
    }
    // Get a user object and delete it
    removeUser() {
        remove(this.User.email);
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
