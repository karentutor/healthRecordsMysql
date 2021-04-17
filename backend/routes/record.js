const express = require('express');

const {
    createRecord,
    editRecord,
    deleteRecord,
    getRecords,
    recordById
} = require('../controllers/record');


const { requireSignin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { patientById } = require('../controllers/patient');
const { createRecordValidator } = require('../validator');

const router = express.Router();

router.get('/records', getRecords);
router.get('/record/:recordId', recordById);
router.delete('/record/:recordId', deleteRecord);
router.post('/record/new/:patientId', createRecord);
router.post('/record/edit/:recordId', editRecord);


// any route containing :userId, our app will first execute userById()
router.param('userId', userById);
// any route containing :postId, our app will first execute postById()
router.param('patientId', patientById);


module.exports = router;


