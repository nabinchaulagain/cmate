import React from "react";
import { Link } from "react-router-dom";
import { MdReportProblem, MdAdd } from "react-icons/md";
import { IoIosPaper } from "react-icons/io";
const Sidebar = () => {
  return (
    <div
      className="col-md-3 col-4"
      style={{ height: "100vh", background: "#a2a6a3" }}
    >
      <ul id="sidebar-list">
        <li>
          <Link to="/admin/">
            <MdReportProblem /> Reports
          </Link>
        </li>
        <li>
          <Link to="/admin/quizzes">
            <IoIosPaper /> Question Papers
          </Link>
        </li>
        <li>
          <Link to="/admin/uploadPaper">
            <MdAdd /> Add New Question Paper
          </Link>
        </li>
      </ul>
    </div>
  );
};
export default Sidebar;
