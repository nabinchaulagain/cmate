const DiscussionReplies = require("../models/DiscussionReplies");
const { deletePics } = require("../utils/discussions");

// GET => discussions/:questionId/replies
const getReplies = async (req, res) => {
  const questionId = req.params.questionId;
  const replies = await DiscussionReplies.find({ questionId }).sort("-_id");
  res.json(replies);
};

// POST => discussions/:questionId/replies
const addReply = async (req, res) => {
  const questionId = req.params.questionId;
  const newReply = new DiscussionReplies({ questionId, user: req.user });
  if (req.fileUploadError) {
    return res.status(400).send(req.fileUploadError);
  }
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("Files are required");
  }
  newReply.images = req.files.map(image => {
    return image.filename;
  });
  res.send(await newReply.save());
};

//PATCH => discussions/:questionId/replies/:replyId
const editReply = async (req, res) => {
  const reply = await DiscussionReplies.findById(req.params.replyId);
  if (!reply) {
    return res.send(404).send("Not found");
  }
  if (req.fileUploadError) {
    return res.status(400).send(req.fileUploadError);
  }
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("Files are required");
  }
  if (req.user._id.toString() !== reply.user._id.toString()) {
    return res.status(403).send("Unauthorized");
  }
  deletePics(...reply.images);
  reply.images = req.files.map(image => {
    return image.filename;
  });
  res.send(await reply.save());
};

//DELETE => discussions/:questionId/replies/:replyId
const deleteReply = async (req, res) => {
  const reply = await DiscussionReplies.findById(req.params.replyId);
  if (!reply) {
    return res.send(404).send("Not found");
  }
  if (req.user._id.toString() !== reply.user._id.toString()) {
    return res.status(403).send("Unauthorized");
  }
  await reply.remove();
  res.send("done");
};

module.exports = { getReplies, editReply, deleteReply, addReply };
