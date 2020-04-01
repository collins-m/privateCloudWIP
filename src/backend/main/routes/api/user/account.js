const express = require('express');
const passport = require('passport');
const rimraf = require('rimraf');

const User = require('../../../models/user');

const router = express.Router();

/**
 * @api {GET} /api/user/{id}                        Get User
 * @apiName GetUser
 * @apiGroup User
 * 
 * @apiHeader   (Authorization) {String}    token   User's unique bearer token
 * 
 * @apiParam    (Query Param)   {String}    id      Mandatory ID assocaited with User account
 * 
 * @apiSuccess  (200 Response)  {JSON}      user    User object
*/
router.get('/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    return res
        .status(200)
        .json({user: req.user});
});

/**
 * @api {DELETE} /api/user/{id}                     Delete User
 * @apiName DeleteUser
 * @apiGroup User
 * 
 * @apiHeader   (Authorization) {String}    token    User's unique bearer token
 * 
 * @apiParam    (Query Param)   {String}    id       Mandatory ID assocaited with User account
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
            console.log("User folder has now been deleted");
        });

        return res
            .status(200)
            .json({
            success: true,
            msg: 'User has now been deleted'
        });
    });
});

module.exports = router;
