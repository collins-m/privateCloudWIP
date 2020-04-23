const mongoose = require('mongoose');

// folder schema
const FolderSchema = mongoose.Schema({
    folderName: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: String,
        required: true
    }
});

// export schema
const Folder = module.exports = mongoose.model('Folder', FolderSchema);

/**
* [find folders by user]
* @param {[String]} user [user pertaining to folders]
* @return {[JSON]} [folder objects]
*/
module.exports.getFoldersByUser = function(user, callback){
    const query = {
        owner: user,
    }
    Folder.find(query, callback);
}

/**
* [find folder by user and name]
* @param {[String]} user [user pertaining to file]
* @param {[String]} folderName [name of folder]
* @return {[JSON]} [file object]
*/
module.exports.getFolderByName = function(user, folderName, callback){
    const query = {
        user: user,
        folderName: folderName
    }
    Folder.findOne(query, callback);
}

/**
* [find folder by user and path]
* @param {[String]} user [user pertaining to folder]
* @param {[String]} path [folder path as known by the user]
* @return {[JSON]} [folder object]
*/
module.exports.getFolderByPath = function(user, path, callback){
    const query = {
        owner: user,
        path: path
    }
    Folder.findOne(query, callback);
}

/**
* [add a new folder]
* @param {[File]} newFolder [Folder object as per above schema]
* @return {[JSON]} [success/failure]
*/
module.exports.addFolder = function(newFolder, callback){
    newFolder.save(callback);
}

/**
* [update folder path]
* @param {[Document]} folder [Folder in question]
* @param {[String]} newPath [new path of folder]
* @return {[JSON]} [success/failure]
*/
module.exports.updatePath = function(folder, newPath, callback){
    folder.path = newPath;
    folder.save(callback);
}

/**
* [update folder name]
* @param {[Document]} folder [Folder in question]
* @param {[String]} newName [new name of folder]
* @return {[JSON]} [success/failure]
*/
module.exports.updateName = function(folder, newName, callback){
    folder.folderName = newName;
    folder.save(callback);
}

/**
 * [delete all folders under a certain user account]
 * @param {[String]} user [String denoting the associated user's email]
 * @return {[null]}
 */
module.exports.deleteAllUserFolders = function(user){
    const query = {
        owner: user
    }
    Folder.find(query, (err, folders) => {
        if (err) throw err;
        folders.forEach(folder => {
            folder.remove();
        });
    });
}