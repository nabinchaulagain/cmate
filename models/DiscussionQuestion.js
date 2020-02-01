const mongoose = require("mongoose");
const DiscussionReplies = require("./DiscussionReplies");
const { deletePics } = require("../utils/discussions");

const voteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId },
  vote: { type: mongoose.Schema.Types.Number, enum: [-1, 1] }
});

const discussionQuestionSchema = new mongoose.Schema({
  question: {
    required: true,
    type: String
  },
  images: { type: Array, default: [] },
  description: { type: String, required: true },
  user: { type: Object, required: true },
  likes: { type: Object, default: {} },
  created_at: { type: Date, default: Date.now },
  votes: [voteSchema]
});

discussionQuestionSchema.pre("remove", function(next) {
  deletePics(...this.images);
  next();
});

discussionQuestionSchema.pre("remove", async function(next) {
  (await DiscussionReplies.find()).forEach(async reply => {
    await reply.remove();
  });
  next();
});

const DiscussionQuestion = mongoose.model(
  "discussionQuestion",
  discussionQuestionSchema
);

module.exports = DiscussionQuestion;
