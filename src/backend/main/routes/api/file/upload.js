const express = require('express');
const path = require('path');
const multer = require('multer');

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

router.post('/upload', upload.single('file'), (req, res, next) => {
    // store reference to file in db
    return res.send(req.file);
})

module.exports = router;