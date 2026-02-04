
const getExample = (req, res) => {
  res.json({
    message: "This is a protected example endpoint",
    user: req.user || "Test User",
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  getExample
};
