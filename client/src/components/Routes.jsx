import React from "react";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
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
    <Switch>
      <Route path="/" component={Homepage} exact />
      <Route path="/results" component={Results} exact />
      <Route path="/quizzes" component={Quizzes} exact />
      {getAdminRoutes(isLoggedIn, user)}
      {getLoginRequiredRoutes(isLoggedIn)}
      <Route path="/discussions" component={DiscussionsHome} exact />
      <Route path="/profile/:id" component={Profile} exact />
      <Route component={PageNotFound} />
    </Switch>
  );
};
const getLoginRequiredRoutes = isLoggedIn => {
  if (isLoggedIn) {
    return [
      <Route path="/quiz/:id" component={Quiz} exact />,
      <Route path="/quizResult/:id" component={QuizResults} exact />
    ];
  }
};

const getAdminRoutes = (isLoggedIn, user) => {
  if (isLoggedIn && user && user.isAdmin === true) {
    return [
      <Route path="/admin" component={Reports} exact />,
      <Route path="/admin/uploadPaper" component={AddPaper} exact />,
      <Route path="/admin/editPaper/:id" component={EditPaper} exact />,
      <Route path="/admin/quizzes" component={QuestionPapers} exact />,
      <Route
        path="/admin/resolve/:paperId/:questionNum"
        component={ResolveReports}
        exact
      />
    ];
  }
};

export default Routes;
