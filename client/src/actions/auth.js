import axios from "axios";
export const updateAuthStatus = () => {
  return async dispatch => {
    try {
      const response = await axios.get("/api/auth/getAuthStatus");
      const userData = response.data;
      dispatch({
        type: "UPDATE_AUTH_STATUS",
        payload: { isLoggedIn: true, user: userData }
      });
    } catch (err) {
      dispatch({
        type: "UPDATE_AUTH_STATUS",
        payload: { isLoggedIn: false, user: null }
      });
    }
  };
};
