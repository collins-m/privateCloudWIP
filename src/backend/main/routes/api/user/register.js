const express = require('express');

const User = require('../../../models/user');const router = express.Router();

/**
* [POST register account]
* @param {[JSON]} req [request should contain 'firstname', 'surname', 'email',
*                     'password' in body]
* @return {[JSON]} [success/failure of operation, bearer token, and user ID]
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
            console.log(err.name);
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
