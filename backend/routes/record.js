const express = require('express');

const {
    createRecord,
    getRecords,
    isPoster,
    photo,
    recordById,
    singleRecord,
    updateRecord
} = require('../controllers/record');


const { requireSignin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { createRecordValidator } = require('../validator');

const router = express.Router();

router.get('/records', getRecords);



// record routes
router.post('/record/new/:userId', requireSignin, createRecord, createRecordValidator);
//router.get('/records/by/:userId', requireSignin, recordsyUser);
router.get('/record/:recordId', singleRecord);
router.put('/record/:recordId', requireSignin, isPoster, updateRecord);
//router.delete('/record/:recordId', requireSignin, isPoster, deleteRecord);
// photo
router.get('/record/photo/:recordId', photo);

// any route containing :userId, our app will first execute userById()
router.param('userId', userById);
// any route containing :postId, our app will first execute postById()
router.param('recordId', recordById);

module.exports = router;
