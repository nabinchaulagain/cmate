import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import history from "../history";
import "../App.css";
import AdminPanel from "./admin/AdminPanel";
import AddPaper from "./admin/AddPaper";
const App = () => {
  return (
    <div>
      <Navbar />
      <Router history={history}>
        <Switch>
          <Route path="/" component={() => <h1>Home component</h1>} exact />
          <Route path="/admin" component={AdminPanel} exact />
          <Route path="/admin/uploadPaper" component={AddPaper} />
        </Switch>
      </Router>
    </div>
  );
};
export default App;
