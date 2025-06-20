const Poll = require('../model/poll');
const Post = require('../model/post');

exports.createPoll = async (req, res) => {
  const { question, options, postId } = req.body;

  try {
    const newPoll = new Poll({
      question,
      options: options.map(opt => ({ text: opt })),
      author: req.user.id
    });
    const poll = await newPoll.save();
    await Post.findByIdAndUpdate(postId, { poll: poll._id });
    res.json(poll);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.votePoll = async (req, res) => {
  const { pollId, optionIndex } = req.body;
  try {
    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ msg: 'Poll not found' });
    
    if (poll.voters.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Already voted' });
    }
    
    poll.options[optionIndex].votes += 1;
    poll.voters.push(req.user.id);
    
    await poll.save();
    res.json(poll);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};