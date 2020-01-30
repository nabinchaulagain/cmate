const mongoose = require("mongoose");
const DiscussionReplies = require("./DiscussionReplies");
const { deletePics } = require("../utils/discussions");
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

discussionPostSchema.pre("remove", function(next) {
  deletePics(...this.images);
  next();
});

discussionPostSchema.pre("remove", async function(next) {
  (await DiscussionReplies.find()).forEach(async reply => {
    await reply.remove();
  });
  next();
});

const DiscussionPost = mongoose.model("discussionPost", discussionPostSchema);

module.exports = DiscussionPost;
