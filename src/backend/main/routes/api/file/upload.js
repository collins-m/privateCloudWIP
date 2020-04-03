const express = require('express');
const passport = require('passport');
const multer = require('multer');
const fs = require('fs');

const File = require('../../../models/file');

const router = express.Router();

// define disk storage instructions
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './public/')
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    callback(null, file.fieldname + '-' + uniqueSuffix)
  }
})
const upload = multer({ storage: storage })

/**
 * @api {POST} /api/file/upload                         Authenticate User
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
router.post('/upload', passport.authenticate('jwt', {session:false}), upload.single('file'), (req, res, next) => {
    // cast data as File object
    let newFile = new File({
        originalFilename: req.file.originalname,
        filename: req.file.filename,
        path: 'public/' + req.body.owner + '/' + req.file.filename + '.enc',
        owner: req.body.owner
    });

    // move file to user subdirectory
    File.moveAndEncryptFile(req.file.path, newFile.path, req.body.cipherKey, (err) => {
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
    })
});

module.exports = router;