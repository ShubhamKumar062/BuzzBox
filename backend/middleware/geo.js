module.exports = (req, res, next) => {
  req.location = {
    type: 'Point',
    coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]
  };
  next();
};