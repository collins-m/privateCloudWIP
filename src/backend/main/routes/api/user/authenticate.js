const express = require('express');
const jwt = require('jsonwebtoken');

const constants = require('../../../../../constants');
const User = require('../../../models/user');

const router = express.Router();

/**
 * @api {POST} /api/user/authenticate                   Authenticate User
 * @apiName AuthenticateUser
 * @apiGroup User
 * 
 * @apiParam    (Request Body)  {String}    email       Mandatory email associated with account
 * @apiParam    (Request Body)  {String}    password    Mandatory password associated with account
 * 
 * @apiSuccess  (200 Response)  {Boolean}   success     Success state of operation
 * @apiSuccess  (200 Response)  {String}    msg         Description of response
 * @apiSuccess  (200 Response)  {String}    token       Authorization token associated with User
 * @apiSuccess  (200 Response)  {String}    id          ID associated with User
 * @apiSuccess  (200 Response)  {JSON}      user        User object containing firstname, surname, and email
 * 
 * @apiSuccess  (400 Response)  {Boolean}   success     Success state of operation
 * @apiSuccess  (400 Response)  {String}    msg         Description of response
 * 
 * @apiSuccess  (404 Response)  {Boolean}   success     Success state of operation
 * @apiSuccess  (404 Response)  {String}    msg         Description of response
 * 
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
                const token = jwt.sign({data: user}, constants.databaseSecret, {
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
