import React from "react";
import Sidebar from "./Sidebar";
import "./Admin.css";
const AdminPanel = () => {
  return (
    <div className="row">
      <Sidebar />
      <div className="jumbotron col-9 p-0" style={{ height: "100vh" }}>
        <h2 className="text-center">Question Papers</h2>
      </div>
    </div>
  );
};
export default AdminPanel;
