const express = require('express');
const passport = require('passport');

const Folder = require('../../../models/folder');

const router = express.Router();

/**
 * @api {GET} /api/folder                               Get User Folders
 * @apiName GetFolders
 * @apiGroup Folder
 * 
 * @apiHeader   (Authorization) {String}    token       User's unique bearer token
 * 
 * @apiSuccess  (200 Response)  {Boolean}   success     Success state of operation
 * @apiSuccess  (200 Response)  {Array}     files       Array of user's files
*/
router.get('/', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    // get all folders owned by a user
    Folder.getFoldersByUser(req.user.email, (err, folders) => {
        if (err) throw err;

        // format response
        let folderArray = [];
        folders.forEach(folder => {
            folderArray.push({
                id: folder._id,
                folderName: folder.folderName,
                path: folder.path,
                favourite: folder.favourite,
                accessList: folder.accessList
            });
        });

        // get all folders shared with a user
        Folder.getFoldersByArrayList(req.user.email, (err, folders) => {
            if (err) throw err;

            // format response
            let sharedFoldersArray = [];
            folders.forEach(folder => {
                sharedFoldersArray.push({
                    id: folder._id,
                    folderName: folder.folderName,
                    path: folder.path,
                    favourite: folder.favourite,
                    accessList: folder.accessList
                });
            });

            // return folders
            return res
                .status(200)
                .json({success: true, folders: folderArray, sharedFolders: sharedFoldersArray});
        });
    });
});

module.exports = router;