const express = require('express');
const passport = require('passport');
const fs = require('fs');

const Folder = require('../../../models/folder');

const router = express.Router();

/**
 * @api {POST} /api/folder/create                       Create Folder
 * @apiName CreateFolder
 * @apiGroup Folder
 * 
 * @apiHeader   (Authorization) {String}    token       User's unique bearer token
 * 
 * @apiParam    (Request Body)  {String}    folderName  Name of folder
 * @apiParam    (Request Body)  {String}    path        Absolute path of folder
 * 
 * @apiSuccess  (201 Response)  {Boolean}   success     Success state of operation
 * @apiSuccess  (201 Response)  {Array}     msg         Description of response
 * 
 * @apiSuccess  (400 Response)  {Boolean}   success     Success state of operation
 * @apiSuccess  (400 Response)  {String}    msg         Description of response
 * 
 * @apiSuccess  (409 Response)  {Boolean}   success     Success state of operation
 * @apiSuccess  (409 Response)  {String}    msg         Description of response
*/
router.post('/create', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    // cast data as Folder object
    if (req.body.path == null) {
        return res
            .status(400)
            .json({success: false, msg: 'All fields must be filled'});
    }
    let newFolder = new Folder({
        folderName: req.body.folderName,
        path: req.body.path,
        owner: req.user.email
    });

    // attempt to add folder
    Folder.addFolder(newFolder, (err, folder) => {
        if (err) {
            return res
                .status(409)
                .json({success: false, msg: 'Failed to create folder'});
        } else {
            // construct response
            const folderResponseObject = {
                folderName: folder.folderName,
                path: '/' + folder.path.split('/').slice(1).join('/')
            }
            // return response
            return res
                .status(201)
                .json({success: true, folder: folderResponseObject});
        }
    });
});

module.exports = router;