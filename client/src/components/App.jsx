import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import "../App.css";
import AdminPanel from "./admin/AdminPanel";
import AddPaper from "./admin/AddPaper";
import Results from "./results/";
import FlashMessage from "./extras/FlashMessage";
import { removeFlashMessage } from "../actions/flashMessage";
import EditPaper from "./admin/EditPaper";
import Reports from "./admin/Reports";
import ResolveReports from "./admin/ResolveReports";
import Quizzes from "./quizzes/QuizzesHome";
import history from "../history";
import Quiz from "./quizzes/Quiz/index";
import QuizResults from "./quizzes/Results/QuizResult";
import DiscussionsHome from "./discussions/DiscussionsHome";
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
        <Route path="/results" component={Results} exact />
        <Route path="/quizzes" component={Quizzes} />
        <Route path="/admin" component={AdminPanel} exact />
        <Route path="/admin/uploadPaper" component={AddPaper} exact />
        <Route path="/admin/editPaper/:id" component={EditPaper} exact />
        <Route path="/admin/reports" component={Reports} exact />
        <Route
          path="/admin/resolve/:paperId/:questionNum"
          component={ResolveReports}
          exact
        />
        <Route path="/quiz/:id" component={Quiz} exact />
        <Route path="/quizResult/:id" component={QuizResults} exact />
        <Route path="/discussions" component={DiscussionsHome} exact />
      </Switch>
    </div>
  );
};
export default App;
