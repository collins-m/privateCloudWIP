const express = require('express');
const path = require('path');
const multer = require('multer');

const File = require('../../../models/file');

const router = express.Router();

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

router.post('/upload', passport.authenticate('jwt', {session:false}), upload.single('file'), (req, res, next) => {
    // cast data as File object
    let newFile = new File({
        originalFilename: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        owner: req.owner
    });

    //attempt to add file
    File.addFile(newFile, (err, file) => {
        if (err) {
            return res
                .status(400)
                .json({success: false, msg: 'Failed to upload file'})
        }
    })
});

module.exports = router;