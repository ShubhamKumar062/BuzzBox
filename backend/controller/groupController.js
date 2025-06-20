const Group = require('../model/group');

exports.createGroup = async (req, res) => {
  const { name, description, location } = req.body;

  try {
    const newGroup = new Group({
      name,
      description,
      admin: req.user.id,
      location
    });

    const group = await newGroup.save();
    res.json(group);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getNearbyGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      location: {
        $near: {
          $geometry: req.location,
          $maxDistance: 5000
        }
      }
    });
    
    res.json(groups);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};