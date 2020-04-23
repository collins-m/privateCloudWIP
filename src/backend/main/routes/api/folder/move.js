const express = require('express');
const passport = require('passport');

const Folder = require('../../../models/folder');

const router = express.Router();

/**
 * @api {PUT} /api/folder/{id}                          Update Folder
 * @apiName UpdateFolder
 * @apiGroup Folder
 * 
 * @apiHeader   (Authorization) {String}    token       User's unique bearer token
 * 
 * @apiParam    (Request Body)  {String}    oldPath    Path that foler is currently located
 * @apiParam    (Request Body)  {String}    [newPath]  Path that user wishes to move folder to
 * @apiParam    (Request Body)  {String}    [newName]  Name that user wishes to change folder to
 * 
 * @apiSuccess  (204 Response)  {null}      null        No body is returned with this response
 * 
 * @apiSuccess  (400 Response)  {Boolean}   success     Success state of operation
 * @apiSuccess  (400 Response)  {String}    msg         Description of response
 * 
 * @apiSuccess  (404 Response)  {Boolean}   success     Success state of operation
 * @apiSuccess  (404 Response)  {String}    msg         Description of response
*/
router.put('/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    // error handling
    if (req.body.oldPath == null) {
        return res
            .status(400)
            .json({success: false, msg: 'oldPath is a required field'});
    } else if ((!req.body.newName == null) && (re.bodynewPath == null)) {
        // rename mechanics

        // find the folder in question
        Folder.getFolderByPath(req.user.email, req.body.oldPath, (err, folder) => {
            if (err) throw err;

            if (folder == undefined) {
                return res
                    .status(404)
                    .json({success: false, msg: 'Folder not found'});
            } else {
                // update the name
                Folder.updateName(folder, req.body.newName, (err, folder) => {
                    if (err) throw err;

                    // return successful response
                    return res
                        .status(204)
                        .json({});
                });
            }
        });
    } else if ((req.body.newName == null) && (!re.bodynewPath == null)) {
        // move mechanics

        // find the folder in question
        Folder.getFolderByPath(req.user.email, req.body.oldPath, (err, folder) => {
            if (err) throw err;

            if (folder == undefined) {
                return res
                    .status(404)
                    .json({success: false, msg: 'Folder not found'});
            } else {
                // update the path
                Folder.updatePath(folder, req.body.newPath, (err, folder) => {
                    if (err) throw err;

                    // return successful response
                    return res
                        .status(204)
                        .json({});
                });
            }
        });
    } else {
        return res
            .status(400)
            .json({success: false, msg: 'Request is not a valid one'});
    }
});

module.exports = router;