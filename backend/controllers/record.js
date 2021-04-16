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

//		 console.log('hi');
//		console.log('profile', req);
		console.table(fields);
		 console.log('profile', req.params);
		 console.log('patient', req.patient);

/*		if (files.photo) {
			//            patient.photo.data = fs.readFileSync(files.photo.path);
			//           patient.photo.contentType = files.photo.type;
		}
*/
		const  {title, body} = fields;
		const patientId = profile.patient_id;
		let query =
			"INSERT INTO `records` (title, body, postedBy) VALUES ('" +
			title +
			"', '" +
			body +
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
	next();
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
