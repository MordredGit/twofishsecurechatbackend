// const url = require("url")

const Chat = require("../models/Chat");
const User = require("../models/User");

const router = require("express").Router();

router.get("/", async (req, res) => {
  const { username, connectname, chat } = req.body;
  // const url = new URL(req.url, `http://${req.headers.host}/`);

  // const { username, connectname } = new URLSearchParams(url.search);
  // const username = req.params.username;
  try {
    let user = await User.findOne({ username });
    let connect = await User.findOne({ connectname });
    if (!user || !connect) {
      return res.status(400).json({ msg: "no user found" });
    }

    Chat.findOne({ name1: username, name2: connectname }, (err, result) => {
      if (err) return res.status(500).json({ msg: "server error" });

      if (!result) {
        Chat.findOne(
          { name1: connectname, name2: username },
          (err, result2) => {
            if (err) return res.status(500).json({ msg: "server error" });

            if (!result2)
              return res.status(400).json({ msg: "no messages found" });

            result2.message.push(chat);
            result2.markModified("message");
            result2.save();
            return res.status(200).json({ msg: "Saved Successfully" });
          }
        );
        return;
      }
      result.message.push(chat);
      result.markModified("message");
      result.save();
      return res.status(200).json({ msg: "Saved Successfully" });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
