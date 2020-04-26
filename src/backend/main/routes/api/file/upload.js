const express = require('express');
const passport = require('passport');
const multer = require('multer');
const fs = require('fs');

const File = require('../../../models/file');
const constants = require('../../../../../constants');

const router = express.Router();

// define disk storage instructions
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, constants.filePath + '/')
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    callback(null, file.fieldname + '-' + uniqueSuffix)
  }
})
const upload = multer({ storage: storage })

/**
 * @api {POST} /api/file/upload                         Upload File
 * @apiName UploadFile
 * @apiGroup File
 * 
 * @apiHeader   (Authorization) {String}    token       User's unique bearer token
 * 
 * @apiParam    (Request Body)  {File}      file        File that user wishes to upload
 * @apiParam    (Request Body)  {String}    passcode    User inputted password to be used in encryption/decryption of file
 * @apiParam    (Request Body)  {String}    path        absolute path of file as seen by the front end user
 * 
 * @apiSuccess  (201 Response)  {Boolean}   success     Success state of operation
 * @apiSuccess  (201 Response)  {String}    msg         Description of response
 * 
 * @apiSuccess  (400 Response)  {Boolean}   success     Success state of operation
 * @apiSuccess  (400 Response)  {String}    msg         Description of response
*/
router.post('/upload', passport.authenticate('jwt', {session:false}), upload.single('file'), (req, res, next) => {
    // cast data as File object
    let newFile;
    try {
      newFile = new File({
        originalFilename: req.file.originalname,
        filename: req.file.filename,
        path: req.body.path,
        serverPath: constants.filePath + '/' + req.user.email + '/' + req.file.filename + '.enc',
        owner: req.user.email
      });
    } catch (TypeError) {
        return res
            .status(400)
            .json({success: false, msg: 'File missing'});
    }

    if (req.body.passcode == null) {
		// delete unencrypted file
		fs.unlinkSync(constants.filePath + '/' + req.file.filename);
        return res
            .status(400)
            .json({success: false, msg: 'passcode field required'});
    } else {
    
        // move file to user subdirectory
        File.moveAndEncryptFile(req.file.path, newFile.serverPath, req.body.passcode, (err) => {
            if (err) {
                console.log(err);
            }
        });

        File.addFile(newFile, (err, file) => {
            if (err) {
                return res
                    .status(400)
                    .json({success: false, msg: 'Failed to upload file'});
            }
            return res
                .status(201)
                .json({success: true, msg: 'Successfully uploaded file'});
        });
    }

});

module.exports = router;