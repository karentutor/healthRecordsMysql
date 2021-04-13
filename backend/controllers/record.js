const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');

// with pagination
exports.getRecords = async (req, res) => {
    // get current page from req.query or use default value of 1
    const currentPage = req.query.page || 1;
    // return 3 records per page
    const perPage = 6;
    let totalItems;

    const records = await Record.find()
        // countDocuments() gives you total count of records
        .countDocuments()
        .then(count => {
            totalItems = count;
            return Record.find()
                .skip((currentPage - 1) * perPage)
                .populate('comments', 'text created')
                .populate('comments.postedBy', '_id name')
                .populate('postedBy', '_id name')
                .select('_id title body created likes')
                .limit(perPage)
                .sort({ created: -1 });
        })
        .then(records => {
            res.status(200).json(records);
        })
        .catch(err => console.log(err));
};

exports.createRecord = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
        //let record = new Record(fields);

        // req.profile.hashed_password = undefined;
        // req.profile.salt = undefined;
        console.log('req', req.profile);
        console.log('profile', req.params);
        console.table('fields', fields);
//        record.postedBy = req.profile;

        if (files.photo) {
            record.photo.data = fs.readFileSync(files.photo.path);
            record.photo.contentType = files.photo.type;
        }

          let query =
        "INSERT INTO `records` (_id, title, body, postedBy, role) VALUES ('" +
        _id +
        "', '" +
        title +
        "', '" +
        body +
        "', '" +
        postedBy +
        "', '" +
        role +
        "')";
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send(result);
    });
        record.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
    });
    
};

exports.recordsByUser = (req, res) => {
    Record.find({ postedBy: req.profile._id })
        .populate('postedBy', '_id name')
        .select('_id title body created likes')
        .sort('_created')
        .exec((err, records) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(records);
        });
};


exports.recordById = (req, res, next, id) => {
    Record.findById(id)
        .populate('postedBy', '_id name')
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name role')
        .select('_id title body created likes comments photo')
        .exec((err, record) => {
            if (err || !record) {
                return res.status(400).json({
                    error: err
                });
            }
            req.record = record;
            next();
        });
};

exports.isPoster = (req, res, next) => {
    let sameUser = req.record && req.auth && req.record.postedBy._id == req.auth._id;
    let adminUser = req.record && req.auth && req.auth.role === 'admin';

    // console.log("req.post ", req.post, " req.auth ", req.auth);
    // console.log("SAMEUSER: ", sameUser, " ADMINUSER: ", adminUser);

    let isPoster = sameUser || adminUser;

    if (!isPoster) {
        return res.status(403).json({
            error: 'User is not authorized'
        });
    }
    next();
};


exports.updateRecord = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            });
        }
        // save record
        let record = req.record;
        record = _.extend(record, fields);
        record.updated = Date.now();

        if (files.photo) {
            record.photo.data = fs.readFileSync(files.photo.path);
            record.photo.contentType = files.photo.type;
        }

        record.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(record);
        });
    });
};

exports.deleteRecord = (req, res) => {
    let record = req.record;
    record.remove((err, record) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({
            message: 'Record deleted successfully'
        });
    });
};

exports.photo = (req, res, next) => {
    res.set('Content-Type', req.record.photo.contentType);
    return res.send(req.record.photo.data);
};

exports.singleRecord = (req, res) => {
    return res.json(req.record);
};


exports.comment = (req, res) => {
    let comment = req.body.comment;
    comment.recordedBy = req.body.userId;

    Record.findByIdAndUpdate(req.body.recordId, { $push: { comments: comment } }, { new: true })
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        });
};

exports.uncomment = (req, res) => {
    let comment = req.body.comment;

    Record.findByIdAndUpdate(req.body.recordId, { $pull: { comments: { _id: comment._id } } }, { new: true })
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        });
};
exports.updateComment = (req, res) => {
    let comment = req.body.comment;

    Record.findByIdAndUpdate(req.body.recordId, { $pull: { comments: { _id: comment._id } } }).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        } else {
            Record.findByIdAndUpdate(
                req.body.recordId,
                { $push: { comments: comment, updated: new Date() } },
                { new: true }
            )
                .populate('comments.postedBy', '_id name')
                .populate('postedBy', '_id name')
                .exec((err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: err
                        });
                    } else {
                        res.json(result);
                    }
                });
        }
    });
};

