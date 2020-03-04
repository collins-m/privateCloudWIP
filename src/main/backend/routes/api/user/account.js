const express = require('express');
const passport = require('passport');

const User = require('../../../models/user');

const router = express.Router();

/**
* [GET account]
* @param {[JSON]} req [request should contain 'id' path param and 'bearer' auth type]
* @return {[JSON]} [user object]
*/
router.get('/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
});

/**
* [DELETE account]
* @param {[JSON]} req [request should contain 'id' path param and 'bearer' auth type]
* @return {[JSON]} [success/failure of operation]
*/
router.delete('/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {

    User.deleteOne({ email: req.body.email }, (err) => {
        if(err){
            throw err;
        }
        res.json({
            success: true,
            msg: 'User has now been deleted'
        });
    });
});

module.exports = router;
