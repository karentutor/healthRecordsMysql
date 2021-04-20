const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');

exports.allUsers = (req, res) => {
     let query = "SELECT * FROM `users`";
    db.query(query, (err, users) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(users);
    });
};


exports.hasAuthorization = (req, res, next) => {
    let sameUser = req.profile && req.auth && req.profile._id == req.auth._id;
    let adminUser = req.profile && req.auth && req.auth.role === 'admin';

    const authorized = sameUser || adminUser;

    if (!authorized) {
        return res.status(403).json({
            error: 'User is not authorized to perform this action'
        });
    }
    next();
};

exports.deleteUser = (req, res, next) => {
    let _id = req.profile._id;

	let query = `DELETE FROM users WHERE _id=${_id}`;
	db.query(query, (err, data) => {
		if (err) {
			return res.status(500).send(err);
		}
		return res.status(200).json({
		message: "suuccess",
		});
	});
};

exports.findPeople = (req, res) => {

	let query = `SELECT * FROM users`;
	db.query(query, (err, data) => {
		if (err) {
			return res.status(500).send(err);
		}
		return res.status(200).json(data);
	});
};

exports.getUser = (req, res) => {
//    req.profile.password = undefined;
//    req.profile.salt = undefined;
    return res.json(req.profile);
};

exports.updateUser = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            });
        }
        // save user
        let user = req.profile;
        user = _.extend(user, fields);

        user.updated = Date.now();
        // console.log("USER FORM DATA UPDATE: ", user);

        if (files.photo) {
            //	record.photo.data = fs.readFileSync(files.photo.path);
            //	record.photo.contentType = files.photo.type;
        }
        
        const { _id, name, email, password } = user;

        let query = `UPDATE users SET name='${name}', email='${email}', password='${password}' WHERE _id=${_id}`;

        db.query(query, (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).json({ message: 'ok' })
        });
 
    });
}

exports.userById = (req, res, next, id) => {

    let query = "SELECT * FROM `users` WHERE `_id` = '" + id + "' ";
        db.query(query, (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }
            let user = JSON.parse(JSON.stringify(data[0]));
            req.profile = user; // adds profile object in req with user info
            next();
        });
    
};


exports.userPhoto = (req, res, next) => {

    if (req.profile.photo.data) {
        res.set(('Content-Type', req.profile.photo.contentType));
        return res.send(req.profile.photo.data);
    }
    next();
};



