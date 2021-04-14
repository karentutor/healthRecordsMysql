const { Console } = require("console");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

exports.comment = (req, res) => {
	console.log(req.body);

	const { recordId, title, body, postedBy, role } = req.body;

	let query =
		"INSERT INTO `comments` (recordId, title, body, postedBy, role) VALUES ('" +
		recordId +
		"', '" +
		title +
		"', '" +
		body +
		"', '" +
		postedBy +
		"', '" +
		role +
		"')";
	db.query(query, (err) => {
		if (err) {
			return res.status(500).send(err);
		}
		let query = "SELECT * FROM `comments` WHERE comments.recordId=" + recordId;

		db.query(query, (err, record) => {
			if (err) {
				return res.status(500).send(err);
			}
			let data = JSON.parse(JSON.stringify(record));
			res.status(200).send(data); 
		});
	});
};

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
			"INSERT INTO `records` (title, body, postedBy, role) VALUES ('" +
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
	let _id = req.record._id;
	let query = `DELETE FROM records WHERE _id=${_id}`;
	db.query(query, (err, data) => {
		if (err) {
			return res.status(500).send(err);
		}
		return res.status(200).json({
			message: "success",
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
	// get record
	let postedBy = req.record.postedBy;

	let query =
		"SELECT r._id, r.title, r.body, r.postedBy, r.created, r.updated, r.role, u.name FROM `records` as `r` INNER JOIN `users` as `u` on r.postedBy = u._id WHERE r._postedBy = '" +
		postedBy +
		"'";

	//	console.log(query);

	db.query(query, (err, record) => {
		if (err) {
			return res.status(500).send(err);
		}
		let data = JSON.parse(JSON.stringify(record[0]));
		req.record = data; // adds profile object in req with user info
		next();
	});

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
				let data = [];

	let query =
		"SELECT r._id as record_id, r.title, r.body, r.postedBy, r.created, r.updated, r.role, u.name, c._id as comment_id, c.title as comment_title, c.body as comment_body FROM `records` as `r` INNER JOIN `users` as `u` ON r.postedBy = u._id INNER JOIN `comments` as c ON r._id = c.recordId WHERE r._id=" +
		id;

	db.query(query, (err, result) => {
		if (err) {
			return res.status(500).send(err);
		}
		let record = JSON.parse(JSON.stringify(result[0]));

		query = "SELECT * FROM `comments` WHERE comments.recordId=" + record.record_id;

		db.query(query, (err, results1) => {
			if (err) {
				return res.status(500).send(err);
			}
			let comments = JSON.parse(JSON.stringify(results1));

			data.record = record;
			data.comments = comments;
		});
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

		let query = `UPDATE records SET title='${title}', body='${body}', postedBy=${postedBy}, role='${role}' WHERE _id=${_id}`;

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
