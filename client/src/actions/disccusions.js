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

export const getQuestion = id => {
  return async dispatch => {
    const response = await axios.get(`/api/discussions/${id}`);
    dispatch({
      type: "GET_QUESTION",
      payload: {
        question: response.data,
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
