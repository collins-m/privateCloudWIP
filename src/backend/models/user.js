// database package handler goes here
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const config = require("../config/database");


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
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = module.exports = mongoose.model("User", UserSchema);

// functions
module.exports.getUserById = function(id, callback){
  User.findbyId(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
  const query = {username: username}
  User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback){
  bcryptjs.genSaltSync(10, (err, salt) => {
    if(err) {
      throw err;
    }
    bcryptjs.hashSync(newUser.password, salt, (err, hash) => {
      if(err) {
        throw err;
      }
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}
