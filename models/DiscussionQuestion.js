const mongoose = require("mongoose");
const DiscussionReplies = require("./DiscussionReplies");
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

discussionPostSchema.pre("remove", async function(next) {
  await DiscussionReplies.deleteMany({
    questionId: mongoose.Types.ObjectId(this._id)
  });
  next();
});

const DiscussionPost = mongoose.model("discussionPost", discussionPostSchema);

module.exports = DiscussionPost;
