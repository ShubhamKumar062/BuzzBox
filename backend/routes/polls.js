const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pollController = require('../controller/pollController');

router.post('/', auth, pollController.createPoll);
router.post('/vote', auth, pollController.votePoll);

module.exports = router;