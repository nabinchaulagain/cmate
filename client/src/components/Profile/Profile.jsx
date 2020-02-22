import React from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
const Profile = props => {
  const [state, setState] = React.useState(null);
  React.useEffect(() => {
    const initializeState = async () => {
      try {
        const response = await axios.get(
          `/api/auth/profile/${props.match.params.id}`
        );
        setState(response.data);
      } catch (error) {
        if (error.response && error.response.status) {
          window.location.href = "/";
        }
      }
    };
    initializeState();
  }, [setState, props]);
  if (!state) {
    return null;
  }
  return (
    <div className="mt-2">
      <Helmet>
        <title>{state.user.name} - Cmate</title>
      </Helmet>
      <div className="col-md-9 mx-auto">
        <h3 className="text-center">
          <img
            src={state.user.profilePic}
            alt={state.user.name}
            style={{ width: 38, height: 38, borderRadius: "100%" }}
          />
          {state.user.name}
        </h3>
        <QuizPerformances results={state.results} />
      </div>
    </div>
  );
};

const QuizPerformances = ({ results }) => {
  if (results.length === 0) {
    return <h4 className="text-center">No quiz history found</h4>;
  }
  return results.map(result => (
    <div
      className="col-sm-6 mx-auto text-center mt-3"
      style={{ background: "#edebeb", borderRadius: 5 }}
    >
      <h5>{result.questionPaper}</h5>
      <h6>{result.correctAnswers} out of 100 answers were correct</h6>
    </div>
  ));
};

export default Profile;
