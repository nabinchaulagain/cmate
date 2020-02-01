import axios from "axios";
import mapKeys from "../utils/mapKeys";
export const getQuestions = (pageNum = 1) => {
  return async dispatch => {
    const response = await axios.get(`/api/discussions?pageNum=${pageNum}`);
    dispatch({
      type: "GET_QUESTIONS",
      payload: {
        questions: mapKeys(response.data.questions, "_id"),
        nextPage: response.data.nextPage,
        currPage: pageNum
      }
    });
  };
};

export const getQuestionReplies = id => {
  return async dispatch => {
    const response = await axios.get(`/api/discussions/${id}/replies`);
    dispatch({
      type: "GET_REPLIES",
      payload: {
        replies: response.data,
        id
      }
    });
  };
};

export const addQuestion = question => {
  return async dispatch => {
    try {
      const response = await axios.post("/api/discussions", question);
      dispatch({
        type: "ADD_QUESTION",
        payload: {
          question: response.data,
          id: response.data._id
        }
      });
    } catch (err) {
      if (err.response && err.response.status) {
        dispatch({
          type: "ERROR",
          payload: {
            message: err.response.data
          }
        });
      }
    }
  };
};

export const editQuestion = (id, question) => {
  return async dispatch => {
    try {
      const response = await axios.patch(`/api/discussions/${id}`, question);
      dispatch({
        type: "EDIT_QUESTION",
        payload: {
          question: response.data,
          id: id
        }
      });
    } catch (err) {
      if (err.response && err.response.status) {
        dispatch({
          type: "ERROR",
          payload: {
            message: err.response.data,
            id
          }
        });
      }
    }
  };
};

export const deleteQuestion = id => {
  return async dispatch => {
    await axios.delete(`/api/discussions/${id}`);
    dispatch({
      type: "DELETE_QUESTION",
      payload: {
        id
      }
    });
  };
};

export const addReply = (questionId, reply) => {
  return async dispatch => {
    const response = await axios.post(
      `/api/discussions/${questionId}/replies`,
      reply
    );
    dispatch({
      type: "ADD_REPLY",
      payload: {
        questionId,
        reply: response.data
      }
    });
  };
};

export const deleteReply = (questionId, replyId) => {
  return async function(dispatch) {
    await axios.delete(`/api/discussions/${questionId}/replies/${replyId}`);
    dispatch({
      type: "DELETE_REPLY",
      payload: {
        questionId,
        replyId
      }
    });
  };
};

export const voteQuestion = (questionId, voteNum) => {
  return async function(dispatch) {
    const response = await axios.put(`/api/discussions/${questionId}/vote`, {
      vote: voteNum
    });
    dispatch({
      type: "LIKE_QUESTION",
      payload: {
        questionId,
        votes: response.data
      }
    });
  };
};
