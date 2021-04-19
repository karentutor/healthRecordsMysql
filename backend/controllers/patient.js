const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");


exports.createPatient = (req, res, next) => {
	
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;
	form.parse(req, (err, fields, files) => {
		if (err) {
			return res.status(400).json({
				error: "Image could not be uploaded",
			});
		}

		let name = fields.name;
		let information = fields.information;
		let postedBy = req.profile._id;
		let role = req.profile.role;


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

exports.deletePatient = (req, res, next) => {

    let _id = req.params.patientId;

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
	let query = "SELECT p._id as patient_id, p.name, p.information, p.postedBy, p.created, p.updated, u.name FROM `patients` as `p` INNER JOIN `users` as `u` on p.postedBy = u._id";

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

	let postedBy = req.profile._id;
	let query = "SELECT p._id as patient_id, p.name, p.information, p.postedBy, p.created, p.updated, u.name FROM `patients` as `p` INNER JOIN `users` as `u` on p.postedBy = u._id WHERE p.postedBy = '" +
	postedBy +
		"'";
	
	console.log(query);
	db.query(query, (err, data) => {
	if (err) {
	 		return res.status(500).send(err);
	 	}
		res.status(200).json(data);
 });

};

exports.patientById = (req, res, next, id) => {
	let query = "SELECT p._id as patient_id, p.name, p.information, p.postedBy, p.created, p.updated, u.name FROM `patients` as `p` INNER JOIN `users` as `u` ON p.postedBy = u._id WHERE p._id=" +id;

	db.query(query, (err, result) => {

		if (err) {
			return res.status(500).send(err);
		} 
		else {
			let data = JSON.parse(JSON.stringify(result[0]));
			req.patient = data; // adds profile object in req with user info
			next();
		}
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


		const { patient_id, name, information, postedBy, role } = patient;

		if (files.photo) {
			//	patient.photo.data = fs.readFileSync(files.photo.path);
			//	patient.photo.contentType = files.photo.type;
		}

		let query = `UPDATE patients SET name='${name}', information='${information}', postedBy=${postedBy} WHERE _id=${patient_id}`;

		db.query(query, (err, data) => {
			if (err) {
				return res.status(500).send(err);
			}
			else {
				let query = `SELECT * FROM patients WHERE _id=${patient_id}`;
				db.query(query, (err, data) => {
					if (err) {
						return res.status(500).send(err);
					} else {
						return res.status(200).send(JSON.stringify(data[0]))
					}
				});
			}
		});
	});//end form parse
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
