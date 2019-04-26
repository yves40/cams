//----------------------------------------------------------------------------
//    user.js
//
//    Apr 24 2019   Initial
//    Apr 26 2019   Some work on methods
//----------------------------------------------------------------------------

const usermodel = require('../models/userModel');
const bcryptjs = require('bcryptjs');

module.exports = class user {
    constructor (usermail) {
        this.Version = 'user:1.11, Apr 26 2019 ';
        this.usermodel = new(usermodel);
        this.usermodel.email = usermail;
    };

    getemail() {return this.usermodel.email;}
    setname(name) { this.usermodel.name = name; }
    getname() { return this.usermodel.name; }
    setemail(email) { this.usermodel.email = email; }
    getemail() { return this.usermodel.email; }
    setpassword(password) { 
        hashPassword(password);
        this.usermodel.password =  hash;
    }
    getpassword() { return this.usermodel.password; }
    setprofilecode(profilecode) { this.usermodel.profilecode = profilecode;  }
    getprofilecode() { return this.usermodel.profilecode; }
    setdescription(description) { this.usermodel.description = description;  }
    getdescription() { return this.usermodel.description; }   
    // Get a user object and update
    updateUser(user) {
        this.usermodel.email = user.email;
        this.usermodel.name = user.name;
        this.usermodel.password = hashPassword(user.password);
        this.usermodel.profilecode = user.profilecode;
        this.usermodel.description = user.description;
    } 
}
//----------------------------------------------------------------------------
// Private 
//----------------------------------------------------------------------------
function hashPassword(password) {
    let salt = bcryptjs.genSaltSync(10);
    let hash = bcryptjs.hashSync(password, salt);
    return hash;
}
