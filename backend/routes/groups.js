const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const geo = require('../middleware/geo');
const groupController = require('../controller/groupController');

router.post('/', auth, groupController.createGroup);
router.get('/nearby', auth, geo, groupController.getNearbyGroups);

module.exports = router;