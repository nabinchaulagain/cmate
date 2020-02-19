import React, { useEffect } from "react";
import { Switch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import "../App.css";
import { removeFlashMessage } from "../actions/flashMessage";
import FlashMessage from "./extras/FlashMessage";
import history from "../history";
import Routes from "./Routes";
const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    history.listen(() => {
      dispatch(removeFlashMessage());
    });
  }, [dispatch]);
  const flashMessage = useSelector(state => {
    return state.flashMessage;
  });
  return (
    <div>
      <Navbar />
      {flashMessage.showFlashMessage && (
        <FlashMessage msg={flashMessage.flashMessage} />
      )}
      <Switch>
        <Routes />
      </Switch>
    </div>
  );
};
export default App;
