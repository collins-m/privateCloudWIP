const express = require('express');
const fs = require('fs');

const User = require('../../../models/user');
const Folder = require('../../../models/folder');

const router = express.Router();

/**
 * @api {POST} /api/user/register                       Register new user
 * @apiName RegisterUser
 * @apiGroup User
 * 
 * @apiParam    (Request Body)  {String}    firstname   Mandatory Firstname of User
 * @apiParam    (Request Body)  {String}    surname     Mandatory Surname of User
 * @apiParam    (Request Body)  {String}    email       Mandatory email associated with account
 * @apiParam    (Request Body)  {String}    password    Mandatory password associated with account
 * 
 * @apiSuccess  (201 Response)  {Boolean}   success     Success state of operation
 * @apiSuccess  (201 Response)  {String}    msg         Description of response
 * 
 * @apiSuccess  (400 Response)  {Boolean}   success     Success state of operation
 * @apiSuccess  (400 Response)  {String}    msg         Description of response
 * 
 * @apiSuccess  (409 Response)  {Boolean}   success     Success state of operation
 * @apiSuccess  (409 Response)  {String}    msg         Description of response
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
            // create uploads folder for new user
            if (!fs.existsSync('./public/' + newUser.email)){
                fs.mkdirSync('./public/' + newUser.email);
            }
            // create folder entry for user
            let newFolder = new Folder({
                folderName: newUser.email,
                path: newUser.email,
                owner: newUser.email
            });
            Folder.addFolder(newFolder, (err, folder) => {
                if (err) throw err;
            });
            
            // return response
            return res
                .status(201)
                .json({success: true, msg: 'User registered'});
        }
    });
});

module.exports = router;
