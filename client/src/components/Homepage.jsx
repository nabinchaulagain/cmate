import React from "react";
import homePageBackground from "../assets/homebackground.jpg";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
const Homepage = () => {
  return (
    <div>
      <Helmet>
        <title>Cmate</title>
        <meta name="description" content="Cmate Homepage" />
      </Helmet>
      <div
        className="mt-2 col-11 mx-auto"
        style={{
          backgroundImage: `url(${homePageBackground})`,
          width: 1200,
          height: 400
        }}
      >
        <div
          style={{
            position: "relative",
            top: "5%",
            color: "rgba(0, 0, 0,0.8)"
          }}
        >
          <h1 className="text-center" style={{ fontSize: "300%" }}>
            CMATE
          </h1>
          <h3 className="mt-2 text-center">Your mate for CMAT exam</h3>
        </div>
      </div>
      <div className="col-md-11 row mx-auto mt-3">
        <ServiceCard
          title="Quizzes"
          description="Play mock quizzes that follow FOMECD format"
          linkBtn={{ to: "/quizzes", text: "Browse Quizzes" }}
        />
        <ServiceCard
          title="Discussions"
          description="Ask a question or read others' questions"
          linkBtn={{ to: "/discussions", text: "Go" }}
        />
        <ServiceCard
          title="Result"
          description="View 2076 CMAT result by FOMECD, TU"
          linkBtn={{ to: "/results", text: "Search Result" }}
        />
      </div>
    </div>
  );
};

const ServiceCard = ({ title, description, linkBtn }) => {
  return (
    <div
      className="col-md-3 col-sm-7 col-9 mx-auto mr-3 mb-2 pb-4 pt-2"
      style={{ background: "#f0f1f2", border: "none", borderRadius: 5 }}
    >
      <h4 className="text-center">{title}</h4>
      <div className="col-10 mx-auto text-left">
        <p>{description}</p>
      </div>
      <div className="text-center">
        <Link to={linkBtn.to} className="btn btn-success">
          {linkBtn.text}
        </Link>
      </div>
    </div>
  );
};

export default Homepage;
