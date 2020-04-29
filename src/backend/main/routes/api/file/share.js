const express = require('express');
const passport = require('passport');

const File = require('../../../models/file');
const User = require('../../../models/user');

const router = express.Router();

/**
 * @api {PUT} /api/file/share                         Share/Unshare File
 * @apiName ShareFile
 * @apiGroup File
 * 
 * @apiHeader   (Authorization) {String}    token       User's unique bearer token
 * 
 * @apiParam    (Request Body)  {String}    path        Path that foler is currently located
 * @apiParam    (Request Body)  {String}    user        User email to share the file with
 * 
 * @apiSuccess  (204 Response)  {null}      null        No body is returned with this response
 * 
 * @apiSuccess  (400 Response)  {Boolean}   success     Success state of operation
 * @apiSuccess  (400 Response)  {String}    msg         Description of response
 * 
 * @apiSuccess  (404 Response)  {Boolean}   success     Success state of operation
 * @apiSuccess  (404 Response)  {String}    msg         Description of response
*/
router.put('/:id/share', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  	// error handling
  	if (req.body.path == null || req.body.user == null) {
    	return res
      		.status(400)
      		.json({success: false, msg: 'Invalid request'});
  	} else {
		const query = {
			email: req.body.user
		}
		// attempt to find user
		User.findOne(query, (err, user) => {
			if (err) throw err;

			if (user == undefined) {
				return res
					.status(404)
					.json({success: false, msg: 'User not found'});
			} else {
				const query2 = {
					path: req.body.path
				}
				// attempt to find file
				File.findOne(query2, (err, file) => {
					if (err) throw err;

					if (file == undefined) {
						return res
							.status(404)
							.json({success: false, msg: 'File not found'});
					} else {
						File.share(file, req.body.user, (err, file) => {
							if (err) throw err;

							return res
								.status(204)
								.json({});
						});
					}
				});
			}
		});
  	}
});

module.exports = router;