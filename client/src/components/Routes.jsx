import React from "react";
import { useSelector } from "react-redux";
import { Route } from "react-router-dom";
import QuestionPapers from "./admin/QuestionPapers";
import AddPaper from "./admin/AddPaper";
import Results from "./results";
import EditPaper from "./admin/EditPaper";
import Reports from "./admin/Reports";
import ResolveReports from "./admin/ResolveReports";
import Quizzes from "./quizzes/QuizzesHome";
import Quiz from "./quizzes/Quiz/index";
import QuizResults from "./quizzes/Results/QuizResult";
import DiscussionsHome from "./discussions/DiscussionsHome";
import Homepage from "./Homepage";
import Profile from "./Profile/Profile";
import PageNotFound from "./404";
const Routes = () => {
  const { isLoggedIn, user } = useSelector(state => state.auth);
  return (
    <React.Fragment>
      <Route path="/" component={Homepage} exact />
      <Route path="/results" component={Results} exact />
      <Route path="/quizzes" component={Quizzes} />
      {isLoggedIn && user && user.isAdmin === true && (
        <React.Fragment>
          <Route path="/admin" component={Reports} exact />
          <Route path="/admin/uploadPaper" component={AddPaper} exact />
          <Route path="/admin/editPaper/:id" component={EditPaper} exact />
          <Route path="/admin/quizzes" component={QuestionPapers} exact />
          <Route
            path="/admin/resolve/:paperId/:questionNum"
            component={ResolveReports}
            exact
          />
        </React.Fragment>
      )}
      {isLoggedIn && (
        <React.Fragment>
          <Route path="/quiz/:id" component={Quiz} exact />
          <Route path="/quizResult/:id" component={QuizResults} exact />
        </React.Fragment>
      )}
      <Route path="/discussions" component={DiscussionsHome} exact />
      <Route path="/profile/:id" component={Profile} exact />
      <Route component={PageNotFound} />
    </React.Fragment>
  );
};

export default Routes;
