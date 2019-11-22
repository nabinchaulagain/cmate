const initialState = { showFlashMessage: false };
const flashMessageReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SHOW_FLASH_MESSAGE":
      return { showFlashMessage: true, flashMessage: action.payload };
    case "DELETE_FLASH_MESSAGE":
      return { showFlashMessage: false };
    default:
      return state;
  }
};
export default flashMessageReducer;
