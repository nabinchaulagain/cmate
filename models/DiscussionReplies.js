const mongoose = require("mongoose");
const discussionRepliesSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "discussionquestion"
  },
  images: {
    type: Array,
    required: true
  },
  user: {
    type: Object,
    required: true
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now
  }
});

const DiscussionReplies = mongoose.model(
  "discussionReply",
  discussionRepliesSchema
);

module.exports = DiscussionReplies;
