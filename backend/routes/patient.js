const express = require('express');

const {
    comment,
    createPatient,
    deletePatient,
    getPatients,
    isPoster,
    photo,
    patientById,
    patientsByUser,
    singlePatient,
    uncomment,
    updateComment,
    updatePatient
} = require('../controllers/patient');


const { requireSignin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { createPatientAddtoBody, createPatientValidator } = require('../validator');

const router = express.Router();

router.get('/patients', getPatients);



// patient routes
router.post('/patient/new/:userId', requireSignin, createPatientAddtoBody, createPatientValidator, createPatient);
router.get('/patients/by/:userId', requireSignin, patientsByUser);
router.get('/patient/:patientId', singlePatient);
router.put('/patient/:patientId', requireSignin, isPoster, updatePatient);
router.delete('/patient/:patientId', requireSignin, isPoster, deletePatient);
// photo
router.get('/patient/photo/:patientId', photo);

// any route containing :userId, our app will first execute userById()
router.param('userId', userById);
// any route containing :postId, our app will first execute postById()
router.param('patientId', patientById);

module.exports = router;
