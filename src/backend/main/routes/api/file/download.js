const express = require('express');
const passport = require('passport');
const fs = require('fs');
const rimraf = require('rimraf');

const File = require('../../../models/file');

const router = express.Router();

/**
 * @api {POST} /api/file/{id}/download                  Download File
 * @apiName DownloadFile
 * @apiGroup File
 * 
 * @apiParam    (Request Body)  {String}    path        path of requested file
 * @apiParam    (Request Body)  {String}    passcode    User inputted password to be used in encryption/decryption of file
 * 
 * @apiSuccess  (200 Response)  {Boolean}   success     Success state of operation
 * @apiSuccess  (200 Response)  {String}    msg         Description of response
 * @apiSuccess  (200 Response)  {File}      download    Downloaded File
 * 
 * @apiSuccess  (400 Response)  {Boolean}   success     Success state of operation
 * @apiSuccess  (400 Response)  {String}    msg         Description of response
 * 
 * @apiSuccess  (404 Response)  {Boolean}   success     Success state of operation
 * @apiSuccess  (404 Response)  {Boolean}   msg         Description of response
*/
router.post('/:id/download', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    // error handling
    if (req.body.passcode == null) {
        return res
            .status(400)
            .json({success: false, msg: 'passcode field required'});
    } else if (req.body.path == null) {
        return res
            .status(400)
            .json({success: false, msg: 'path field required'});
    } else {
        // find the requested file
        File.getFileByPath(req.user.email, req.body.path, (err, file) => {
            if (err) throw err;
            if (file == undefined) {
                return res
                    .status(404)
                    .json({success: false, msg: 'file not found'})
            }
            // decrypt file
            const sourceFilePath = './' + file.serverPath;
            const tmpDir = './public/' + req.user.email + '/tmp';
            const tmpFilePath = tmpDir + '/' + file.originalFilename;
            if (!fs.existsSync(tmpDir)){
                fs.mkdirSync(tmpDir);                
            }
            File.moveAndDecryptFile(sourceFilePath, tmpFilePath, req.body.passcode, () => {
                // download file
                return res.download(tmpFilePath, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            });
        });
    }
});

module.exports = router;