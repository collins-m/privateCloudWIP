const express = require('express');
const path = require('path');
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

// define move operation for files
moveFile = function(oldPath, newPath, callback) {
    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            if (err.code === 'EXDEV') {
                copy();
            } else {
                callback(err);
            }
            return;
        }
        callback();
    });

    function copy() {
        var readStream = fs.createReadStream(oldPath);
        var writeStream = fs.createWriteStream(newPath);

        readStream.on('error', callback);
        writeStream.on('error', callback);

        readStream.on('close', function () {
            fs.unlink(oldPath, callback);
        });

        readStream.pipe(writeStream);
    }
}

router.post('/upload', passport.authenticate('jwt', {session:false}), upload.single('file'), (req, res, next) => {
    // cast data as File object
    let newFile = new File({
        originalFilename: req.file.originalname,
        filename: req.file.filename,
        path: 'public/' + req.body.owner + '/' + req.file.filename,
        owner: req.body.owner
    });

    // move file to user subdirectory
    moveFile(req.file.path, newFile.path, (err) => {
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