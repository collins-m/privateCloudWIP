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
    // get all folders pertaining to a user
    Folder.getFoldersByUser(req.user.email, (err, folders) => {
        if (err) throw err;

        // format response
        let folderArray = [];
        folders.forEach(folder => {
            const path = folder.path;
            folderArray.push({
                id: folder._id,
                folderName: folder.folderName,
                path: path
            });
        });

        // return folders
        return res
            .status(200)
            .json({success: true, folders: folderArray});
    });
});

module.exports = router;