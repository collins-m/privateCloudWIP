const express = require('express');
const passport = require('passport');

const File = require('../../../models/file');

const router = express.Router();

/**
 * @api {PUT} /api/file/{id}                            Move File
 * @apiName MoveFile
 * @apiGroup File
 * 
 * @apiHeader   (Authorization) {String}    token       User's unique bearer token
 * 
 * @apiParam    (Request Body)  {String}    oldPath    Path that file is currently located
 * @apiParam    (Request Body)  {String}    newPath    Path that user wishes to move file to
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
    if (req.body.oldPath == null || req.body.newPath == null) {
        return res
            .status(400)
            .json({success: false, msg: 'all fields must be filled'});
    } else {
        // find the file in question
        File.getFileByPath(req.user.email, req.body.oldPath,(err, file) => {
            if (err) throw err;

            if (file == undefined) {
                return res
                    .status(404)
                    .json({success: false, msg: 'File not found'});
            } else {
                // update the path
                File.updatePath(file, req.body.newPath, (err, file) => {
                    if (err) throw err;

                    // return successful response
                    return res
                        .status(204)
                        .json({});
                });
            }
        });
    }
});

module.exports = router;