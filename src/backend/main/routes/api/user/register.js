const express = require('express');

const User = require('../../../models/user');const router = express.Router();

/**
 * @api {POST} /api/user/register       Register new user.
 * @apiName RegisterUser
 * @apiGroup User
 * 
 * @apiParam {String} firstname         Mandatory Firstname of User.
 * @apiParam {String} surname           Mandatory Surname of User.
 * @apiParam {String} email             Mandatory email associated with account.
 * @apiParam {String} password          Mandatory password associated with account.
 * 
 * @apiSuccess (201) {Boolean} success  Success state of operation.
 * @apiSuccess (201) {String} msg       Description of response.
*/
router.post('/register', (req, res, next) => {
    // cast data as User object
    let newUser = new User({
        firstname: req.body.firstname,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password
    });

    // attempt to add user
    User.addUser(newUser, (err, user) => {
        if (err) {
            if (err.name == "ValidationError") {
                return res
                .status(400)
                .json({success: false, msg: 'All fields must be filled'});
            } else {
                return res
                    .status(409)
                    .json({success: false, msg: 'Failed to register user'});
            }
        }
        else {
            return res
                .status(201)
                .json({success: true, msg: 'User registered'});
        }
    });
});

module.exports = router;
