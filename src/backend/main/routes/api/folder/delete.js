const express = require('express');
const passport = require('passport');

const Folder = require('../../../models/folder');

const router = express.Router();

/**
 * @api {DELETE} /api/folder/{id}                    Delete Folder
 * @apiName DeleteFolder
 * @apiGroup Folder
 * 
 * @apiHeader   (Authorization) {String}    token    User's unique bearer token
 * 
 * @apiParam    (Request Body)  {String}    path     Path that foler is currently located
 * 
 * @apiSuccess  (200 Response)  {Boolean}   success  Success state of operation
 * @apiSuccess  (200 Response)  {String}    msg      Description of response
 * 
 * @apiSuccess  (400 Response)  {Boolean}   success  Success state of operation
 * @apiSuccess  (400 Response)  {String}    msg      Description of response
 * 
 * @apiSuccess  (404 Response)  {Boolean}   success  Success state of operation
 * @apiSuccess  (404 Response)  {String}    msg      Description of response
*/
router.delete('/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    if (!(req.body.path == null)) {
        const query = {
            owner: req.user.email,
            path: req.body.path
        }
        Folder.getFolderByPath(req.user.email, req.body.path, (err, folder) => {
            if (err) throw err;

            if (folder == undefined) {
                return res
                    .status(404)
                    .json({success: false, msg: 'Folder not found'});
            } else {
                // delete folder
                Folder.deleteOne(query, (err) => {
                    if(err) throw err;
                    
                    return res
                        .status(200)
                        .json({success: true, msg: 'Folder has now been deleted'});
                });
            }
        })
    } else {
        return res
            .status(400)
            .json({success: false, msg: 'Invalid request'});
    }
});

module.exports = router;
