const mongoose = require('mongoose');
const fs = require('fs');
const zlib = require('zlib');
const crypto = require('crypto');

const AppendInitVector = require('../config/appendInitVector');

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
    serverPath: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: String,
        required: true
    },
    favourite: {
        type: Boolean,
        default: false,
        required: true
    },
    accessList: {
        type: [String],
        default: [],
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
* [find file by user and path]
* @param {[String]} user [user pertaining to file]
* @param {[String]} path [file path as known by the user]
* @return {[JSON]} [file object]
*/
module.exports.getFileByPath = function(user, path, callback){
    const query = {
        owner: user,
        path: path
    }
    File.findOne(query, callback);
}

/**
* [find files by user]
* @param {[String]} user [user pertaining to files]
* @return {[JSON]} [file objects]
*/
module.exports.getFilesByUser = function(user, callback){
    const query = {
        owner: user,
    }
    File.find(query, callback);
}

/**
* [find files by accessList]
* @param {[String]} user [user pertaining to files]
* @return {[JSON]} [file objects]
*/
module.exports.getFilesByArrayList = function(user, callback){
    const query = {
        accessList: user,
    }
    File.find(query, callback);
}

/**
* [add a new file]
* @param {[File]} newFile [File object as per above schema]
* @return {[JSON]} [success/failure]
*/
module.exports.addFile = function(newFile, callback){
    newFile.save(callback);
}

/**
* [update file path]
* @param {[Document]} file [File in question]
* @param {[String]} newPath [new path of file]
* @return {[JSON]} [success/failure]
*/
module.exports.updatePath = function(file, newPath, callback){
        file.path = newPath;
        file.save(callback);
}

/**
* [update file name]
* @param {[Document]} file [File in question]
* @param {[String]} newName [new name of file]
* @return {[JSON]} [success/failure]
*/
module.exports.updateName = function(file, newName, callback){
    const newPath = file.path.split('/').slice(0, -1).join('/') + '/' + newName;
    file.originalFilename = newName;
    file.path = newPath;
    file.save(callback);
}

/**
* [update file path]
* @param {[Document]} file [File in question]
* @param {[Boolean]} favourite [favourite status of file]
* @return {[JSON]} [success/failure]
*/
module.exports.updateFavouriteStatus = function(file, favourite, callback){
    file.favourite = favourite;
    file.save(callback);
}

/**
* [share file]
* @param {[Document]} file [File in question]
* @param {[String]} user [user to share file with]
* @return {[JSON]} [success/failure]
*/
module.exports.share = function(file, user, callback){
    if (!file.accessList.includes(user)) {
        file.accessList.push(user);
    } else {
        file.accessList.pop(user);
    }
    file.save(callback);
}

/**
 * [delete all files under a certain user account]
 * @param {[String]} user [String denoting the associated user's email]
 * @return {[null]}
 */
module.exports.deleteAllUserFiles = function(user){
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

/**
 * [move, compress, and encrypt a file]
 * @param {[String]} sourcePath [source path of file]
 * @param {[String]} destPath [destination path of file]
 * @param {[String]} passcode [user supplied passcode used to generate cipher key]
 * @return {[null]}
 */
module.exports.moveAndEncryptFile = function(sourcePath, destPath, passcode, callback) {
    // generate pseudo random initialization vector
    const initVector = crypto.randomBytes(16);
    // generate cipher key from passcode
    const cipherKey = crypto.createHash('sha256').update(String(passcode)).digest();
    const readStream = fs.createReadStream(sourcePath);
    const gzipStream = zlib.createGzip();
    const cipher = crypto.createCipheriv('aes256', cipherKey, initVector);
    const appendInitVector = new AppendInitVector(initVector);
    // create write stream with new file extension
    const writeStream = fs.createWriteStream(destPath);

    // pipe stream
    readStream
        .pipe(gzipStream)
        .pipe(cipher)
        .pipe(appendInitVector)
        .pipe(writeStream);
        
    // delete source file
    fs.unlink(sourcePath, (err) => {
        if (err) throw err;
    });
}

/**
 * [move, decompress, and decrypt a file]
 * @param {[String]} sourcePath [source path of file]
 * @param {[String]} destPath [destination path of file]
 * @param {[String]} passcode [user supplied passcode used to generate cipher key]
 * @return {[null]}
 */
module.exports.moveAndDecryptFile = function(sourcePath, destPath, passcode, callback) {
    // create stream to read initialization vector
    const readIv = fs.createReadStream(sourcePath, { end: 15 });
    // get init vector
    let initVector;
    readIv.on('data', (chunk) => {
        initVector = chunk;
    });

    // decrypt file
    readIv.on('close', ()=> {
        // generate cipher key from passcode
        const cipherKey = crypto.createHash('sha256').update(passcode).digest();
        const readStream = fs.createReadStream(sourcePath, { start: 16 });
        const decipher = crypto.createDecipheriv('aes256', cipherKey, initVector);
        const unzip = zlib.createUnzip();
        // create write stream
        const writeStream = fs.createWriteStream(destPath);

        // pipe stream
        readStream
            .pipe(decipher)
            .pipe(unzip)
            .pipe(writeStream);

        // return write stream
        return writeStream;
    });
}