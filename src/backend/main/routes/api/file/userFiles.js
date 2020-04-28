const express = require('express');
const passport = require('passport');

const File = require('../../../models/file');

const router = express.Router();

/**
 * @api {GET} /api/file                                 Get User Files
 * @apiName GetFiles
 * @apiGroup File
 * 
 * @apiHeader   (Authorization) {String}    token       User's unique bearer token
 * 
 * @apiSuccess  (200 Response)  {Boolean}   success     Success state of operation
 * @apiSuccess  (200 Response)  {Array}     files       Array of user's files
*/
router.get('/', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    // get all files pertaining to a user
    File.getFilesByUser(req.user.email, (err, files) => {
        if (err) throw err;

        // format response
        let fileArray = [];
        files.forEach(file => {
            fileArray.push({
                id: file._id,
                filename: file.originalFilename,
                path: file.path,
                favourite: file.favourite
            });
        });

        // return files
        return res
            .status(200)
            .json({success: true, files: fileArray});
    });
});

module.exports = router;