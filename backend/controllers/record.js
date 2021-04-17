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

		/*		if (files.photo) {
			//            patient.photo.data = fs .readFileSync(files.photo.path);
			//           patient.photo.contentType = files.photo.type;
		}
*/
		const { body, postedBy, role, title } = fields;
		const patientId = req.patient.patient_id;
		let query =
			"INSERT INTO `records` (patient_id, title, body, postedBy, role) VALUES ('" +
			patientId +
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
			} else {
				res.status(200).send({ message: 'Record created'});
				
			}
		});
	});
};

exports.deleteRecord = (req, res, next) => {

    let _id = req.params.recordId;

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
exports.editRecord = async(req,res) => {
	console.log('h');
	next();
}

exports.getRecords = async (req, res) => {
	let query = "SELECT * FROM `records` ";

	db.query(query, (err, data) => {
		if (err) {
			return res.status(500).send(err);
		}
		res.status(200).send(data);
	});
};

exports.recordById = (req, res, next) => {

	const _id = req.params.recordId;

	let query = "SELECT r._id as record_id, r.title, r.body, r.postedBy, r.created, r.updated, u.name  FROM `records` as `r` INNER JOIN `users` as `u` ON r.postedBy = u._id WHERE r._id=" +_id;

	db.query(query, (err, result) => {

		if (err) {
			return res.status(500).send(err);
		} 
		else {
			let data = JSON.parse(JSON.stringify(result[0]));
			res.status(200).json(data);
		}
	});
};
