var express = require('express');
var controller = require('../controllers/controller');
const router = express.Router();

router.post('/register', controller.register);
router.get('/commonstudents', controller.retrieveStudent);
router.post('/suspend', controller.suspend);
router.post('/retrievefornotifications', controller.retrieveForNotifications);

module.exports = router;
