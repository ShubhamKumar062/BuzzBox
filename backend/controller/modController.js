const Post = require('../model/post');
const User = require('../model/user');


exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const user = await User.findById(req.user.id);
    if (user.role === 'user') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.addModerator = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    const user = await User.findById(req.params.userId);
    
    if (!group || !user) return res.status(404).json({ msg: 'Not found' });
    
    if (group.admin.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    group.moderators.push(user.id);
    await group.save();
    res.json(group);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};