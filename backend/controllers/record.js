const { Console } = require("console");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");


exports.createRecord = (req, res, next) => {
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;
	form.parse(req, (err, fields, files) => {
		if (err) {
			return res.status(400).json({
				error: "Image could not be uploaded",
			});
		}

		// req.profile.hashed_password = undefined;
		// // req.profile.salt = undefined;
		let _id = "121";
		let title = fields.title;
		let body = fields.title;
		let postedBy = req.profile._id;
		let role = req.profile.role;
		// console.log(fields.body);
		// console.log(req.profile._id);
		// console.log('profile', req.params);

		if (files.photo) {
			//            record.photo.data = fs.readFileSync(files.photo.path);
			//           record.photo.contentType = files.photo.type;
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
		db.query(query, (err, data) => {
			if (err) {
				return res.status(500).send(err);
			}
			res.status(200).send(data);
		});
	});
};


exports.deleteRecord = (req, res) => {
	let record = req.record;
	record.remove((err, record) => {
		if (err) {
			return res.status(400).json({
				error: err,
			});
		}
		res.json({
			message: "Record deleted successfully",
		});
	});
};


exports.getRecords = async (req, res) => {

    let query = "SELECT * FROM `records` "; 

		db.query(query, (err, data) => {
			if (err) {
				return res.status(500).send(err);
			}
			res.status(200).send(data);
		});

};

exports.isPoster = (req, res, next) => {
	let sameUser = req.record && req.auth && req.record.postedBy == req.auth._id;
	let adminUser = req.record && req.auth && req.auth.role === "admin";
	let isPoster = sameUser || adminUser;

	if (!isPoster) {
		return res.status(403).json({
			error: "User is not authorized",
		});
	}
	next();
};


exports.photo = (req, res, next) => {
		res.set("Content-Type", req.record.photo.contentType);
	//return res.status(404);
		return send(req.record.photo.data);
};


exports.recordsByUser = (req, res) => {
	Record.find({ postedBy: req.profile._id })
		.populate("postedBy", "_id name")
		.select("_id title body created likes")
		.sort("_created")
		.exec((err, records) => {
			if (err) {
				return res.status(400).json({
					error: err,
				});
			}
			res.json(records);
		});
};

exports.recordById = (req, res, next, id) => {

	let query = "SELECT r._id, r.title, r.body, r.postedBy, r.created, r.updated, r.role, u.name FROM `records` as `r` INNER JOIN `users` as `u` on r.postedBy = u._id WHERE r._id = '" + id + "'";
	
	db.query(query, (err, record) => {
            if (err) {
                return res.status(500).send(err);
			}
			let data = JSON.parse(JSON.stringify(record[0]));
            req.record = data; // adds profile object in req with user info
            next();
        });

};



exports.singleRecord = (req, res) => {
	return res.json(req.record);
};

exports.updateRecord = (req, res, next) => {
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;
	form.parse(req, (err, fields, files) => {
		if (err) {
			return res.status(400).json({
				error: "Photo could not be uploaded",
			});
		}
		// save record
		let record = req.record;
		record = _.extend(record, fields);
		record.updated = Date.now();


		const { _id, title, body, postedBy, role } = record;

		if (files.photo) {
		//	record.photo.data = fs.readFileSync(files.photo.path);
		//	record.photo.contentType = files.photo.type;
		}

		let query = `UPDATE records SET title='${title}', body='${body}', postedBy=${postedBy}, role='${role}'`;

		console.log(query);
/*
		db.query(query, (err, data) => {
			if (err) {
				return res.status(500).send(err);
			}
			res.status(200).send(data);
		});
	*/next();
	});
};



