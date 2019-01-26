//----------------------------------------------------------------------------
//    userModel.js
//
//    Nov 10 2018   Initial
//    Nov 11 2018   Add a delete all users method + some others
//    Nov 21 2018   Get a user by email
//    Dec 03 2018   Add a local user strategy
//    Jan 17 2019   Transfered to the CAMS project
//    Jan 22 2019   Add a user profile
//    Jan 25 2019   Add getUserByID()
//----------------------------------------------------------------------------
const Version = 'userModel.js 1.24 Jan 25 2019 ';

const objectid = require('mongodb').ObjectId;
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const schema = mongoose.Schema;

const userschema = new schema(
    {
        name: String,
        email: String,
        password: String,
        profilecode: 0,
    }
);
const User = mongoose.model("user", userschema);

module.exports = User;

//-----------------------------------------------------------------------------------
// Create a user
//-----------------------------------------------------------------------------------
module.exports.createUser = (newuser, callback) => {
    bcryptjs.genSalt(10, (err, salt) => {
        bcryptjs.hash(newuser.password, salt, (error, hash) => {
            // Store the hashed password
            const newuseresource = newuser;
            newuseresource.profilecode = newuser.profilecode;
            newuseresource.password = hash;
            newuseresource.save(callback);
        });
    });
};

//-----------------------------------------------------------------------------------
// List users
//-----------------------------------------------------------------------------------
module.exports.listUsers = (callback) => {
    console.log(Version + 'GET all users');
    User.find({}, 'name email password profilecode', callback); 
};

//-----------------------------------------------------------------------------------
// Get a user by ID
//-----------------------------------------------------------------------------------
module.exports.getUserByID = (ID, callback) => {
    // User.collection.findOne({ "_id": objectid(ID) }, callback);
    User.findById(ID, callback);
};

//-----------------------------------------------------------------------------------
// Get a user by email
//-----------------------------------------------------------------------------------
module.exports.getUserByEmail = (email, callback) => {
    const query = { email };
    User.findOne(query, callback);
};


//-----------------------------------------------------------------------------------
// Password checking
//-----------------------------------------------------------------------------------
module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcryptjs.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
};

//-----------------------------------------------------------------------------------
// Delete one user with its ID
//-----------------------------------------------------------------------------------
module.exports.deleteoneUserByID = (id, callback) => {
    try {
        User.collection.deleteOne( { "_id": objectid(id) }, callback );
    }
    catch(e) {
        console.log(e);
    }
};

//-----------------------------------------------------------------------------------
// Delete one user with its name
//-----------------------------------------------------------------------------------
module.exports.deleteoneUserByName = (name, callback) => {
    try {
        User.collection.deleteOne( { "name":  name }, callback );
    }
    catch(e) {
        console.log(e);
    }
};

//-----------------------------------------------------------------------------------
// Delete all users
//-----------------------------------------------------------------------------------
module.exports.deleteallUsers = (callback) => {
    // User.collection.remove(callback);
    User.collection.deleteMany(callback);
};

