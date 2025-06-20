const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const geo = require('../middleware/geo');
const postController = require('../controller/postController');

router.post('/', auth, postController.createPost);
router.get('/nearby', auth, geo, postController.getNearbyPosts);

module.exports = router;