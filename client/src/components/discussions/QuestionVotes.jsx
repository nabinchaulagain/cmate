import React from "react";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { voteQuestion } from "../../actions/disccusions";
const Votes = ({ votes, questionId }) => {
  const { user, isLoggedIn } = useSelector(state => state.auth);
  return (
    <React.Fragment>
      <div>Votes</div>
      <div style={{ fontSize: "120%" }}>
        {votes.reduce(
          (totalVotes = 0, currentVote) => totalVotes + currentVote.vote,
          0
        )}{" "}
      </div>
      {isLoggedIn && (
        <VoteActions votes={votes} user={user} questionId={questionId} />
      )}
    </React.Fragment>
  );
};
const VoteActions = ({ user, votes, questionId }) => {
  const [voteState, setVoteState] = React.useState(null);
  const dispatch = useDispatch();
  React.useEffect(() => {
    const voteIndex = votes.findIndex(vote => vote.userId === user._id);
    if (voteIndex !== -1) {
      setVoteState(votes[voteIndex].vote);
    } else {
      setVoteState(null);
    }
  }, [votes]);
  return (
    <React.Fragment>
      <FaThumbsUp
        size={16}
        style={{ cursor: "pointer", marginRight: 8 }}
        color={voteState === 1 ? "#065fd4" : "black"}
        onClick={() => {
          if (voteState === 1) {
            dispatch(voteQuestion(questionId, null));
          } else {
            dispatch(voteQuestion(questionId, 1));
          }
        }}
      />
      <FaThumbsDown
        size={16}
        style={{ cursor: "pointer" }}
        color={voteState === -1 ? "#065fd4" : "black"}
        onClick={() => {
          if (voteState === -1) {
            dispatch(voteQuestion(questionId, null));
          } else {
            dispatch(voteQuestion(questionId, -1));
          }
        }}
      />
    </React.Fragment>
  );
};

export default Votes;
