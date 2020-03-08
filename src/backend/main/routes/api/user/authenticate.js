const express = require('express');
const jwt = require('jsonwebtoken');

const config = require('../../../config/database');
const User = require('../../../models/user');

const router = express.Router();

/**
 * @api {POST} /api/user/authenticate   Authenticate User.
 * @apiName AuthenticateUser
 * @apiGroup User
 * 
 * @apiParam {String} email             Mandatory email associated with account.
 * @apiParam {String} password          Mandatory password associated with account.
 * 
 * @apiSuccess (200) {Boolean} success  Success state of operation.
 * @apiSuccess (200) {String} msg       Description of response.
 * @apiSuccess (200) {String} token     Authorization token associated with User.
 * @apiSuccess (200) {String} id        ID associated with User
 * @apiSuccess (200) {JSON} user        User object containing firstname, surname, and email.
*/
router.post('/authenticate', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    // get user
    User.getUserByEmail(email, (err, user) => {
        if(err) throw err;
        if(!user){
            return res
                .status(404)
                .json({success: false, msg: 'User not found'});
        }

        // compare provided password with one in DB
        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign({data: user}, config.secret, {
                    expiresIn: 86400 // 24 hours in seconds
                });

                return res
                    .status(200)
                    .json({
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
                return res
                    .status(400)
                    .json({success: false, msg: 'Wrong password'});
            }
        });
    });
});

module.exports = router;
