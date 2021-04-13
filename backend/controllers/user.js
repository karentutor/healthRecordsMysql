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

    // console.log("req.profile ", req.profile, " req.auth ", req.auth);
    // console.log("SAMEUSER", sameUser, "ADMINUSER", adminUser);

    if (!authorized) {
        return res.status(403).json({
            error: 'User is not authorized to perform this action'
        });
    }
    next();
};

exports.deleteUser = (req, res, next) => {
    let user = req.profile;
    User.remove((err, user) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({ message: 'User deleted successfully' });
    });
};

exports.findPeople = (req, res) => {
    let following = req.profile.following;
    following.push(req.profile._id);
    User.find({ _id: { $nin: following } }, (err, users) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json(users);
    }).select('name');
};



exports.getUser = (req, res) => {
    req.profile.password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

// exports.updateUser = (req, res, next) => {
//     let user = req.profile;
//     user = _.extend(user, req.body); // extend - mutate the source object
//     user.updated = Date.now();
//     user.save(err => {
//         if (err) {
//             return res.status(400).json({
//                 error: "You are not authorized to perform this action"
//             });
//         }
//         user.hashed_password = undefined;
//         user.salt = undefined;
//         res.json({ user });
//     });
// };

exports.updateUser = (req, res, next) => {
    let form = new formidable.IncomingForm();
    // console.log("incoming form data: ", form);
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            });
        }
        // save user
        let user = req.profile;
        // console.log("user in update: ", user);
        user = _.extend(user, fields);

        user.updated = Date.now();
        // console.log("USER FORM DATA UPDATE: ", user);

        if (files.photo) {
            user.photo.data = fs.readFileSync(files.photo.path);
            user.photo.contentType = files.photo.type;
        }

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            // console.log("user after update with formdata: ", user);
            res.json(user);
        });
    });
};

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
    
    // User.findById(id)
    //     // populate followers and following users array
    //     .populate('following', '_id name')
    //     .populate('followers', '_id name')
    //     .exec((err, user) => {
    //         if (err || !user) {
    //             return res.status(400).json({
    //                 error: 'User not found'
    //             });
    //         }
    //         req.profile = user; // adds profile object in req with user info
    //         next();
//        });
};


exports.userPhoto = (req, res, next) => {
    console.log(req.profile);
    if (req.profile.photo.data) {
        res.set(('Content-Type', req.profile.photo.contentType));
        return res.send(req.profile.photo.data);
    }
    next();
};



