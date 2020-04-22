const express = require('express');
const passport = require('passport');
const rimraf = require('rimraf');

const User = require('../../../models/user');
const File = require('../../../models/file');

const router = express.Router();

/**
 * @api {GET} /api/user/                            Get User
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
 * @api {DELETE} /api/user/                          Delete User
 * @apiName DeleteUser
 * @apiGroup User
 * 
 * @apiHeader   (Authorization) {String}    token    User's unique bearer token
 * 
 * @apiSuccess  (200)           {Boolean}   success  Success state of operation
 * @apiSuccess  (200)           {String}    msg      Description of response
*/
router.delete('/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {

    User.deleteOne({ email: req.body.email }, (err) => {
        if(err){
            throw err;
        }
        // delete user upload folder
        rimraf('./public/' + req.body.email, () => {

            // delete file collection entries associated with user
            File.deleteAllUserFiles(req.body.email, (err) => {
                if (err) throw err;
            });

            return res
                .status(200)
                .json({
                success: true,
                msg: 'User has now been deleted'
            });
        });
    });
});

module.exports = router;
