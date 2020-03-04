const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const config = require('../config/database');

// user schema
const UserSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    surname: {
      type: String,
      required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// export schema
const User = module.exports = mongoose.model('User', UserSchema);

/**
* [find user by their ID]
* @param {[String]} id [ID pertaining to user]
* @return {[JSON]} [user object]
*/
module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

/**
* [find user by their email]
* @param {[String]} id [email pertaining to user]
* @return {[JSON]} [user object]
*/
module.exports.getUserByEmail = function(email, callback){
    const query = {email: email}
    User.findOne(query, callback);
}

/**
* [add a new user]
* @param {[User]} newUser [User object as per above schema]
* @return {[JSON]} [success/failure]
*/
module.exports.addUser = function(newUser, callback){
    bcryptjs.genSalt(10, (err, salt) => {
        bcryptjs.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

/**
* [compare two passwords]
* @param {[String]} attempt [attempted password attempt]
* @param {[String]} hash [correct password]
* @return {[bool]} [success/failure of operation]
*/
module.exports.comparePassword = function(attempt, hash, callback){
    bcryptjs.compare(attempt, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
}
