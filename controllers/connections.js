const Chat = require("../models/Chat");
const Connections = require("../models/Connections");
const User = require("../models/User");

const router = require("express").Router();

const createKey = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
const allowCors = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
};

// Future: Change to async await
router.post("/createconnection", allowCors, (req, res) => {
  const { username, connectionName } = req.body;
  User.findOne({ name: connectionName }, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ msg: "err", error: err });
    }
    if (!result) return res.status(200).json({ msg: "no user found" });
    // Assumption: Connection is not already there
    // Future: Create logic for already present connection
    Connections.findOne({ name: result.name }, (err, result_) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: "err", error: err });
      }
      if (!result_) {
        let connections = new Connections({
          name: connectionName,
          connections: {
            [username]: false,
          },
        });
        return connections.save();
      }
      result_.connections[username] = false;
      result_.markModified("connections");
      result_.save();
    });

    Connections.findOne({ name: username }, (err, result_) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: "err", error: err });
      }
      if (!result_) {
        let connections = new Connections({
          name: username,
          connections: { [connectionName]: false },
        });
        return connections.save();
      }
      result_.connections[connectionName] = false;
      result_.markModified("connections");
      result_.save();
    });

    console.log(result);
    return res.status(200).json({ name: result.name });
  });
});

router.post("/acceptconnection", (req, res) => {
  const { username, connectionName } = req.body;
  Connections.findOne({ name: username }, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ msg: "err", error: err });
    }
    if (!result)
      return res.status(200).json({ msg: "err", error: "no user found" });

    console.log(result);
    if (!(username in result.connections) || !result.connections[username]) {
      result.connections[username] = true;
      result.markModified("connections");
      result.save();
      console.log(result);
      // return res.status(200).json({ msg: "Connection Added Successfully" });
    } else {
      let chat = new Chat({
        name1: username,
        name2: connectionName,
        messages: [],
      });
      chat.save();
    }
    // Connections.findOne({ name: connectionName }, (err, result_) => {
    //   if (err) {
    //     console.log(err);
    //     return res.status(500).json({ msg: "err", error: err });
    //   }
    //   if (!result_)
    //     return res.status(200).json({ msg: "err", error: "no user found" });

    //   if (!result_.connections[username]) {
    //     result_.connections[username] = true;
    //     result_.markModified("connections");
    //     result_.save();
    //     console.log(result);
    //     return res.status(200).json({ msg: "Connection Added Successfully" });
    //   } else {
    //     let chat = new Chat({
    //       name1: username,
    //       name2: connectionName,
    //       messages: [],
    //     });
    //     chat.save();
    //   }
    // });
  });
  // console.log(result);
  res.status(200).json({ msg: "Connection Added Successfully" });
});

// Future: Change to async await
router.get("/user/:username", (req, res) => {
  const username = req.params.username;

  Connections.findOne({ name: username }, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ msg: "err", error: err });
    }

    if (!result)
      return res.status(200).json({ msg: "err", error: "no user found" });
    console.log(result ? result.connections : "");
    res.status(200).json(result);
  });
});

module.exports = router;
