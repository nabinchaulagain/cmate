import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQuestionReplies, deleteReply } from "../../actions/disccusions";
import renderLoading from "../extras/renderLoading";
import { GoCommentDiscussion } from "react-icons/go";
import ReplyForm from "./ReplyForm";
import { ProfilePicReusable } from "../extras/ProfilePic";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";
import QuestionForm from "./QuestionForm";
import flashMessage from "../../utils/flashMessage";
const QuestionReplies = ({ id }) => {
  const dispatch = useDispatch();
  const replies = useSelector(state => state.discussions.questions[id].replies);
  React.useEffect(() => {
    dispatch(getQuestionReplies(id));
  }, []);
  if (!replies) {
    return renderLoading("Loading Replies................");
  }
  return (
    <div className="mt-2 p-0">
      <h5 className="text-left">
        <GoCommentDiscussion />
        {replies.length} Replies
      </h5>
      <ReplyForm id={id} />
      <div className="mt-3">
        {replies.map(reply => (
          <QuestionReply key={reply._id} reply={reply} />
        ))}
      </div>
    </div>
  );
};

const QuestionReply = ({ reply }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  return (
    <div className="text-left mt-4 mb-4">
      <div onClick={() => setIsOpen(!isOpen)}>
        {!isOpen && <IoMdArrowDropright size={24} />}
        {isOpen && <IoMdArrowDropdown size={24} />}
        <ProfilePicReusable user={reply.user} size={20} />
      </div>
      {isOpen && (
        <React.Fragment>
          <div className="row mt-2">
            {reply.images.map(image => {
              return (
                <div className="col-4" key={image}>
                  <img
                    src={`/images/${image}`}
                    alt="reply image"
                    style={{ width: "90%" }}
                  />
                </div>
              );
            })}
          </div>
          {user._id === reply.user._id && (
            <div className="mt-2 text-left">
              <button
                className="btn btn-danger btn-sm ml-3"
                onClick={() => {
                  dispatch(deleteReply(reply.questionId, reply._id));
                  flashMessage(dispatch, "Reply Removed");
                }}
              >
                Delete
              </button>
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

export default QuestionReplies;
