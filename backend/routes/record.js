const express = require('express');

// const {
//     getRecords,
//     createRecord,
//     recordsByUser,
//     recordById,
//     isPoster,
//     updateRecord,
//     deleteRecord,
//     photo,
//     singleRecord,
//     comment,
//     uncomment,
//     updateComment
// } = require('../controllers/record');


const {
    createRecord
} = require('../controllers/record');


const { requireSignin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { createRecordValidator } = require('../validator');

const router = express.Router();

//router.get('/records', getRecords);


// // comments
// router.put('/record/comment', requireSignin, comment);
// router.put('/record/uncomment', requireSignin, uncomment);
// router.put('/record/updatecomment', requireSignin, updateComment);

// // post routes
router.post('/record/new/:userId', requireSignin, createRecord, createRecordValidator);
// router.get('/records/by/:userId', requireSignin, recordsByUser);
// router.get('/record/:recordId', singleRecord);
// router.put('/record/:recordId', requireSignin, isPoster, updateRecord);
// router.delete('/record/:recordId', requireSignin, isPoster, deleteRecord);
// // photo
// router.get('/record/photo/:recordId', photo);

// // any route containing :userId, our app will first execute userById()
router.param('userId', userById);
// // any route containing :record, our app will first execute recordById()
//router.param('recordId', recordById);

module.exports = router;
