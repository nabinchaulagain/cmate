import { showFlashMessage, removeFlashMessage } from "../actions/flashMessage";
const flashMessage = (dispatch, msg, startTime = 800, stopTime = 4000) => {
  setTimeout(() => {
    dispatch(showFlashMessage(msg));
  }, startTime);
  setTimeout(() => dispatch(removeFlashMessage()), stopTime);
};
export default flashMessage;
