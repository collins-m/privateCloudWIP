const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const config = require('../config/database');

// file schema
const FileSchema = mongoose.Schema({
    originalFilename: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    }
});

// export schema
const File = module.exports = mongoose.model('File', FileSchema);

/**
* [find file by ID]
* @param {[String]} id [ID pertaining to file]
* @return {[JSON]} [file object]
*/
module.exports.getFileById = function(id, callback){
    File.findById(id, callback);
}

/**
* [find file by user and name]
* @param {[String]} user [user pertaining to file]
* @return {[JSON]} [file object]
*/
module.exports.getFileByName = function(user, originalFilename, callback){
    const query = {
        user: user,
        originalFilename: originalFilename
    }
    File.findOne(query, callback);
}

/**
* [add a new file]
* @param {[User]} newFile [File object as per above schema]
* @return {[JSON]} [success/failure]
*/
module.exports.addFile = function(newFile, callback){
    newFile.save(callback);
}

module.exports.deleteAllUserFiles = function(user, callback){
    const query = {
        owner: user
    }
    File.find(query, (err, files) => {
        if (err) throw err;
        files.forEach(file => {
            file.remove();
        });
    });
}