const inititalState = { questions: null };
const discussionsReducer = (state = inititalState, action) => {
  switch (action.type) {
    case "GET_QUESTIONS":
      if (state.questions === null) {
        return {
          ...state,
          questions: action.payload.questions,
          nextPage: action.payload.nextPage,
          currPage: action.payload.currPage
        };
      }
      return {
        ...state,
        questions: {
          ...state.questions,
          ...action.payload.questions
        },
        nextPage: action.payload.nextPage,
        currPage: action.payload.currPage
      };
    case "GET_QUESTION":
      return {
        ...state,
        questions: {
          ...state.questions,
          [action.payload.id]: action.payload.question
        }
      };
    case "ADD_QUESTION":
      return {
        ...state,
        questions: {
          [action.payload.id]: action.payload.question,
          ...state.questions
        }
      };
    case "EDIT_QUESTION":
      return {
        questions: {
          ...state.questions,
          [action.payload.id]: action.payload.question
        }
      };
    case "DELETE_QUESTION":
      const newState = { ...state };
      delete newState.questions[action.payload.id];
      return newState;
    case "ERROR":
      if (action.payload.id) {
        return {
          ...state,
          serverError: {
            ...state.serverError,
            [action.payload.id]: action.payload.message
          }
        };
      }
      return { ...state, serverError: { add: action.payload.message } };
    default:
      break;
  }
  return state;
};
export default discussionsReducer;
