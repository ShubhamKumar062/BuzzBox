const Post = require('../model/post');
const Group = require('../model/group');

exports.createPost = async (req, res) => {
  const { title, content, groupId, location } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ msg: 'Group not found' });

    const newPost = new Post({
      title,
      content,
      author: req.user.id,
      group: groupId,
      location
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getNearbyPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      location: {
        $near: {
          $geometry: req.location,
          $maxDistance: 5000
        }
      }
    }).populate('author', 'username').populate('group', 'name');
    
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};