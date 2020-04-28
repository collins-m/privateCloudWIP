const express = require('express');
const passport = require('passport');
const rimraf = require('rimraf');
const fs = require('fs');

const User = require('../../../models/user');
const File = require('../../../models/file');
const Folder = require('../../../models/folder');

const router = express.Router();

/**
 * @api {GET} /api/user/{id}                        Get User
 * @apiName GetUser
 * @apiGroup User
 * 
 * @apiHeader   (Authorization) {String}    token   User's unique bearer token
 * 
 * @apiSuccess  (200 Response)  {JSON}      user    User object
*/
router.get('/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {

    const user = {
        id: req.user._id,
        firstname: req.user.firstname,
        surname: req.user.surname,
        email: req.user.email
    }
    return res
        .status(200)
        .json({user: user});
});

/**
 * @api {DELETE} /api/user/{id}                      Delete User
 * @apiName DeleteUser
 * @apiGroup User
 * 
 * @apiHeader   (Authorization) {String}    token    User's unique bearer token
 * 
 * @apiSuccess  (200 Response)  {Boolean}   success  Success state of operation
 * @apiSuccess  (200 Response)  {String}    msg      Description of response
*/
router.delete('/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {

    User.deleteOne({ email: req.user.email }, (err) => {
        if(err){
            throw err;
        }
        // delete user upload folder
        rimraf('./public/' + req.user.email, () => {

            // delete file collection entries associated with user
            File.deleteAllUserFiles(req.user.email, (err) => {
                if (err) throw err;
            });
            // delete folder collection entries associated with user
            Folder.deleteAllUserFolders(req.user.email, (err) => {
                if (err) throw err;
            });
            // return response
            return res
                .status(200)
                .json({success: true, msg: 'User has now been deleted'});
        });
    });
});

module.exports = router;
