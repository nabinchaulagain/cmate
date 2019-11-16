import React from "react";
import { Link } from "react-router-dom";
import { IoIosPaper } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
const Sidebar = () => {
  return (
    <div className="col-3" style={{ height: "100vh", background: "#a2a6a3" }}>
      <ul id="sidebar-list">
        <li>
          <Link to="/admin/uploadPaper">
            <IoIosPaper /> Add New Question Paper
          </Link>
        </li>
        <li>
          <Link to="/admin/Users">
            <FaUsers /> Users
          </Link>
        </li>
      </ul>
    </div>
  );
};
export default Sidebar;
