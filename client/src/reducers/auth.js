const initialState = { isLoggedIn: "TBD", user: null };
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_AUTH_STATUS":
      return {
        ...state,
        isLoggedIn: action.payload.isLoggedIn,
        user: action.payload.user
      };
    default:
      return state;
  }
};
export default authReducer;
