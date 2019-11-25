import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import "../App.css";
import AdminPanel from "./admin/AdminPanel";
import AddPaper from "./admin/AddPaper";
import FlashMessage from "./extras/FlashMessage";
import { removeFlashMessage } from "../actions/flashMessage";
import history from "../history";
const App = props => {
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
        <Route path="/" component={() => <h1>Home component</h1>} exact />
        <Route path="/admin" component={AdminPanel} exact />
        <Route path="/admin/uploadPaper" component={AddPaper} />
      </Switch>
    </div>
  );
};
export default App;
