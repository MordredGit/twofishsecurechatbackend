const Connections = require("../models/Connections");
const User = require("../models/User");

const router = require("express").Router();

router.post("/", (req, res) => {
  const { connectName } = req.body;
  User.find({ name: connectName }, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).json({ msg: err });
    }
    console.log(result);
    res.status(200).json(result);
  });
});

router.get("/user/:username", (req, res) => {
  const username = req.params.username;

  Connections.findOne({ name: username }, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ msg: err });
    }
    console.log(result.connections);
    res.status(200).json(result.connections);
  });
});

module.exports = router;
