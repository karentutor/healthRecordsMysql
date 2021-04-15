const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

// exports.comment = (req, res) => {
// 	console.log(req.body);

// 	const { patientId, title, body, postedBy, role } = req.body;

// 	let query =
// 		"INSERT INTO `comments` (patientId, title, body, postedBy, role) VALUES ('" +
// 		patientId +
// 		"', '" +
// 		title +
// 		"', '" +
// 		body +
// 		"', '" +
// 		postedBy +
// 		"', '" +
// 		role +
// 		"')";
// 	db.query(query, (err) => {
// 		if (err) {
// 			return res.status(500).send(err);
// 		}
// 		let query = "SELECT * FROM `comments` WHERE comments.patientId=" + patientId;

// 		db.query(query, (err, patient) => {
// 			if (err) {
// 				return res.status(500).send(err);
// 			}
// 			let data = JSON.parse(JSON.stringify(patient));
// 			res.status(200).send(data); 
// 		});
// 	});
// };

exports.createPatient = (req, res, next) => {
	
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
		let name = fields.name;
		let information = fields.information;
		let postedBy = req.profile._id;
		let role = req.profile.role;

		// console.log(fields.body);
		// console.log(req.profile._id);
		// console.log('profile', req.params);

		if (files.photo) {
			//            patient.photo.data = fs.readFileSync(files.photo.path);
			//           patient.photo.contentType = files.photo.type;
		}

		let query =
			"INSERT INTO `patients` (name, information, postedBy) VALUES ('" +
			name +
			"', '" +
			information +
			"', '" +
			postedBy +
			"')";
		
		db.query(query, (err, data) => {
			if (err) {
				return res.status(500).send(err);
			}
			res.status(200).send(data);
		});
	});
};

exports.deletePatient = (req, res) => {
	let _id = req.patient._id;
	let query = `DELETE FROM patients WHERE _id=${_id}`;
	db.query(query, (err, data) => {
		if (err) {
			return res.status(500).send(err);
		}
		return res.status(200).json({
			message: "success",
		});
	});
};

exports.getPatients = async (req, res) => {
	let query = "SELECT * FROM `patients` ";

	db.query(query, (err, data) => {
		if (err) {
			return res.status(500).send(err);
		}
		res.status(200).send(data);
	});
};

exports.isPoster = (req, res, next) => {
	let sameUser = req.patient && req.auth && req.patient.postedBy == req.auth._id;
	let adminUser = req.patient && req.auth && req.auth.role === "admin";
	let isPoster = sameUser || adminUser;

	if (!isPoster) {
		return res.status(403).json({
			error: "User is not authorized",
		});
	}
	next();
};

exports.photo = (req, res, next) => {
	res.set("Content-Type", req.patient.photo.contentType);
	//return res.status(404);
	return send(req.patient.photo.data);
};

exports.patientsByUser = (req, res) => {
	// get patient
	let postedBy = req.patient.postedBy;

	let query =
		"SELECT r._id, r.title, r.body, r.postedBy, r.created, r.updated, r.role, u.name FROM `patients` as `r` INNER JOIN `users` as `u` on r.postedBy = u._id WHERE r._postedBy = '" +
		postedBy +
		"'";

	//	console.log(query);

	db.query(query, (err, patient) => {
		if (err) {
			return res.status(500).send(err);
		}
		let data = JSON.parse(JSON.stringify(patient[0]));
		req.patient = data; // adds profile object in req with user info
		next();
	});

	Patient.find({ postedBy: req.profile._id })
		.populate("postedBy", "_id name")
		.select("_id title body created likes")
		.sort("_created")
		.exec((err, patients) => {
			if (err) {
				return res.status(400).json({
					error: err,
				});
			}
			res.json(patients);
		});
};

exports.patientById = (req, res, next, id) => {
				let data = [];

	let query =
		"SELECT p._id as patient_id, p.name, p.information, p.postedBy, p.created, p.updated, u.name FROM `patients` as `p` INNER JOIN `users` as `u` ON p.postedBy = u._id WHERE p._id=" +
		id;

	db.query(query, (err, result) => {
		if (err) {
			return res.status(500).send(err);
		}
		let data = JSON.parse(JSON.stringify(result[0]));
		req.patient = data; // adds profile object in req with user info
		next();
	});
};

exports.singlePatient = (req, res) => {
	return res.json(req.patient);
};

exports.updatePatient = (req, res, next) => {
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;
	form.parse(req, (err, fields, files) => {
		if (err) {
			return res.status(400).json({
				error: "Photo could not be uploaded",
			});
		}
		// save patient
		let patient = req.patient;
		patient = _.extend(patient, fields);
		patient.updated = Date.now();

		const { _id, title, body, postedBy, role } = patient;

		if (files.photo) {
			//	patient.photo.data = fs.readFileSync(files.photo.path);
			//	patient.photo.contentType = files.photo.type;
		}

		let query = `UPDATE patients SET title='${title}', body='${body}', postedBy=${postedBy}, role='${role}' WHERE _id=${_id}`;

		db.query(query, (err, data) => {
			if (err) {
				return res.status(500).send(err);
			}
			res.status(200).send(data);
		});
	});
};

exports.uncomment = (req, res) => {
	let comment = req.body.comment;

	Post.findByIdAndUpdate(
		req.body.postId,
		{ $pull: { comments: { _id: comment._id } } },
		{ new: true }
	)
		.populate("comments.postedBy", "_id name")
		.populate("postedBy", "_id name")
		.exec((err, result) => {
			if (err) {
				return res.status(400).json({
					error: err,
				});
			} else {
				res.json(result);
			}
		});
};

exports.updateComment = async (req, res) => {
	const comment = req.body.comment;
	// const id = req.body.id;
	const postId = req.body.postId;
	const userId = req.body.userId;
	// comment.postedBy = req.body.userId;

	const result = await Post.findByIdAndUpdate(
		postId,
		{
			$set: {
				comments: {
					_id: comment._id,
					text: comment.text,
					postedBy: userId,
				},
			},
		},
		{ new: true, overwrite: false }
	)
		.populate("comments.postedBy", "_id name")
		.populate("postedBy", "_id name");
	res.json(result);
};

exports.updateComment = (req, res) => {
	let comment = req.body.comment;

	Post.findByIdAndUpdate(req.body.postId, {
		$pull: { comments: { _id: comment._id } },
	}).exec((err, result) => {
		if (err) {
			return res.status(400).json({
				error: err,
			});
		} else {
			Post.findByIdAndUpdate(
				req.body.postId,
				{ $push: { comments: comment, updated: new Date() } },
				{ new: true }
			)
				.populate("comments.postedBy", "_id name")
				.populate("postedBy", "_id name")
				.exec((err, result) => {
					if (err) {
						return res.status(400).json({
							error: err,
						});
					} else {
						res.json(result);
					}
				});
		}
	});
};

/*
// update commennt by Alaki
exports.updateComment = async (req, res) => {
  const commentId = req.body.id;
  const comment = req.body.comment;
 
  const updatedComment = await Post.updateOne(
    { comments: { $elemMatch: { _id: commentId } } },
    { $set: { "comments.$.text": comment } }
  );
  if (!updatedComment)
    res.status(404).json({ message: Language.fa.NoPostFound });
 
  res.json(updatedComment);
};
// update commennt with auth
exports.updateComment = async (req, res) => {
  const commentId = req.body.id;
  const comment = req.body.comment;
  const postId = req.params.id;
 
  const post = await Post.findById(postId);
  const com = post.comments.map(comment => comment.id).indexOf(commentId);
  const singleComment = post.comments.splice(com, 1);
  let authorized = singleComment[0].commentedBy;
  console.log("Security Check Passed ?", req.auth._id == authorized);
 
  if (authorized != req.auth._id)
    res.status(401).json({ mesage: Language.fa.UnAuthorized });
 
  const updatedComment = await Post.updateOne(
    { comments: { $elemMatch: { _id: commentId } } },
    { $set: { "comments.$.text": comment } }
  );
  if (!updatedComment)
    res.status(404).json({ message: Language.fr.NoPostFound });
 
  res.json({ message: Language.fr.CommentUpdated });
};
 */
