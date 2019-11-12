import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import "../App.css";
const App = () => {
  const [authData, setAuthData] = useState({});
  useEffect(() => {
    (async () => {
      const authStatus = await axios.get("/api/auth/getAuthStatus");
      setAuthData(authStatus.data);
    })();
  }, []);
  return (
    <div>
      <Navbar authData={authData} cc={<h1>Hello Siraj</h1>} />
      <h1>Hello</h1>
      <a href="/api/auth/login">Login</a>
      <a href="/api/auth/logout">Logout</a>
    </div>
  );
};
export default App;
