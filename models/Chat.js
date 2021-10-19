const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema({
  name1: {
    type: String,
    required: true,
  },
  name2: {
    type: String,
    required: true,
  },
  messages: [
    {
      time: {
        type: Date,
        default: Date.now,
        required: true,
      },
      speaker: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("chat", ChatSchema);
