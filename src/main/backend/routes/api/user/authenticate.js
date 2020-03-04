const express = require('express');
const jwt = require('jsonwebtoken');

const config = require('../../../config/database');
const User = require('../../../models/user');

const router = express.Router();

/**
* [POST authenticate user]
* @param {[JSON]} req [request should contain 'email' and 'password' in body]
* @return {[JSON]} [success/failure of operation, bearer token, and user ID]
*/
router.post('/authenticate', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    // get user
    User.getUserByEmail(email, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: 'User not found'});
        }

        // compare provided password with one in DB
        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign({data: user}, config.secret, {
                    expiresIn: 86400 // 24 hours in seconds
                });

                res.json({
                    success: true,
                    msg: 'Login successful',
                    token: 'bearer ' + token,
                    id: user._id,
                    user: {
                        firstname: user.firstname,
                        surname: user.surname,
                        email: user.email
                    }
                });
            } else {
                return res.json({success: false, msg: 'Wrong password'});
            }
        });
    });
});

module.exports = router;
