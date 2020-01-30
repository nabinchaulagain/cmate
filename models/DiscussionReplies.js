const mongoose = require("mongoose");
const { deletePics } = require("../utils/discussions");
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

discussionRepliesSchema.pre("remove", function(next) {
  console.log("called");
  deletePics(...this.images);
  next();
});

const DiscussionReplies = mongoose.model(
  "discussionReply",
  discussionRepliesSchema
);

module.exports = DiscussionReplies;
