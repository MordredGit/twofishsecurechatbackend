const Chat = require("../models/Chat");

const router = require("express").Router();

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

router.post("/chats", allowCors, (req, res) => {
  const { username, connectionName } = req.body;
  Chat.findOne({ name1: username, name2: connectionName }, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ msg: "err", error: err });
    }

    if (!result) {
      Chat.findOne(
        { name1: username, name2: connectionName },
        (err, result_) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ msg: "err", error: err });
          }

          if (!result_) {
            let chat = new Chat({
              name1: username,
              name2: connectionName,
              messages: [],
            });
            chat.save();
            return res.status(200).json({ msg: "err", error: "no chat found" });
          }

          return res
            .status(200)
            .json({ msg: "successful", data: result_.messages });
        }
      );
    }

    return res.status(200).json({ msg: "successful", data: result.messages });
  });
});
