const mongoose = require("mongoose");
const discussionPostSchema = new mongoose.Schema({
  question: {
    required: true,
    type: String
  },
  images: { type: Array, default: [] },
  description: { type: String, required: true },
  user: { type: Object, required: true },
  likes: { type: Object, default: {} },
  created_at: { type: Date, default: Date.now }
});

const DiscussionPost = mongoose.model("discussionPost", discussionPostSchema);

module.exports = DiscussionPost;
