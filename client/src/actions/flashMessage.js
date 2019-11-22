export const showFlashMessage = flashMessage => {
  return dispatch => {
    dispatch({
      type: "SHOW_FLASH_MESSAGE",
      payload: flashMessage
    });
  };
};

export const removeFlashMessage = () => {
  return dispatch => {
    dispatch({
      type: "DELETE_FLASH_MESSAGE"
    });
  };
};
