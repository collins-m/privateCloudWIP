const express = require('express');
const passport = require('passport');

const File = require('../../../models/file');

const router = express.Router();

// TODO: change documentation

/**
 * @api {GET} /api/file/                                Get User Files
 * @apiName GetFiles
 * @apiGroup File
 * 
 * @apiHeader   (Authorization) {String}    token       User's unique bearer token
 * 
 * @apiSuccess  (200 Response)  {Boolean}   success     Success state of operation
 * @apiSuccess  (200 Response)  {Array}     files       Array of user's files
 * 
 * @apiSuccess  (400 Response)  {Boolean}   success     Success state of operation
 * @apiSuccess  (400 Response)  {String}    msg         Description of response
*/
router.get('/', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    // get all files pertaining to a user
    File.getFilesByUser(req.user.email, (err, files) => {
        if (err) throw err;

        // format response
        let fileArray = [];
        files.forEach(file => {
            const path = file.path.split('/').slice(1, -1).join('/') + '/' + file.originalFilename;
            fileArray.push({
                filename: file.originalFilename,
                path: path
            });
        });

        // return files
        return res
            .status(200)
            .json({success: true, files: fileArray});
    });
});

module.exports = router;