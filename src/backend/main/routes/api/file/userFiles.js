const express = require('express');
const passport = require('passport');

const File = require('../../../models/file');

const router = express.Router();

// TODO: change documentation

/**
 * @api {POST} /api/file/upload                         Upload File
 * @apiName UploadFile
 * @apiGroup File
 * 
 * @apiParam    (Request Body)  {File}      file        File that user wishes to upload
 * @apiParam    (Request Body)  {String}    owner       User email - owner of the uploaded file
 * @apiParam    (Request Body)  {String}    passcode    User inputted password to be used in encryption/decryption of file
 * 
 * @apiSuccess  (201 Response)  {Boolean}   success     Success state of operation
 * @apiSuccess  (201 Response)  {String}    msg         Description of response
 * 
 * @apiSuccess  (400 Response)  {Boolean}   success     Success state of operation
 * @apiSuccess  (400 Response)  {String}    msg         Description of response
*/
router.get('/:user', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    // error handling
    if (!req.query.user) {
        return res
            .status(400)
            .json({success: false, msg: 'No user specified'});
    }

    // get all files pertaining to a user
    File.getFilesByUser(req.query.user, (err, files) => {
        if (err) throw err;

        return res
            .status(200)
            .json({files: files});
    });
});

module.exports = router;