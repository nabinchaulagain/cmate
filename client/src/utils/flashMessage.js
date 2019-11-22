import { showFlashMessage, removeFlashMessage } from "../actions/flashMessage";
const flashMessage = (dispatch, msg) => {
  dispatch(showFlashMessage(msg));
  setTimeout(() => dispatch(removeFlashMessage()), 3000);
};
export default flashMessage;
