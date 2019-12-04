import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import "../App.css";
import AdminPanel from "./admin/AdminPanel";
import AddPaper from "./admin/AddPaper";
import Results from "./results/Result";
import FlashMessage from "./extras/FlashMessage";
import { removeFlashMessage } from "../actions/flashMessage";
import ResultContext from "./results/ResultContext"
import EditPaper from "./admin/EditPaper";
import history from "../history";
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
        <Route path="/" component={() => <h1>Home component</h1>} exact />
        <Route path="/results" component={()=>{
          return(
            <ResultContext>
              <Results/>
            </ResultContext>
          )
        }} exact/>
        <Route path="/admin" component={AdminPanel} exact />
        <Route path="/admin/uploadPaper" component={AddPaper} />
        <Route path="/admin/editPaper/:id" component={EditPaper} />
      </Switch>
    </div>
  );
};
export default App;
