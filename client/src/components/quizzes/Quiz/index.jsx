import React from "react";
import QuizProvider from "./QuizProvider";
import Quiz from "./Quiz";
import axios from "axios";
import renderLoading from "../../extras/renderLoading";
export default props => {
  const [initialValues, setInitialValues] = React.useState("unset");
  const [showQuiz, setShowQuiz] = React.useState(false);
  React.useEffect(() => {
    axios
      .get(`/api/getQuizProgress?paperId=${props.match.params.id}`)
      .then(response => setInitialValues(response.data))
      .catch(err => {
        setInitialValues({ timeRemaining: 5400, answers: {} });
        setShowQuiz(true);
      });
  }, []);
  if (initialValues !== "unset") {
    if (showQuiz) {
      return (
        <QuizProvider
          quizId={props.match.params.id}
          initialValues={initialValues}
        >
          <Quiz />
        </QuizProvider>
      );
    } else {
      return (
        <div style={{ overflowY: "hidden", height: "100%" }}>
          <div
            className="col-7 col-lg-5  mx-auto"
            style={{
              height: "45%",
              background: "#d4d4d4",
              position: "absolute",
              top: "30%",
              left: "30%",
              textAlign: "center"
            }}
          >
            <div style={{ transform: "translateY(35%)", height: "100%" }}>
              <h4>Continue or Restart?</h4>
              <button
                className="btn btn-success mr-2"
                onClick={() => {
                  setShowQuiz(true);
                }}
              >
                Continue
              </button>
              <button
                className="btn btn-danger"
                onClick={async () => {
                  setInitialValues({ timeRemaining: 5400, answers: {} });
                  try {
                    await axios.delete(
                      `/api/deleteQuizProgress?paperId=${props.match.params.id}`
                    );
                  } catch (err) {}
                  setShowQuiz(true);
                }}
              >
                Restart
              </button>
            </div>
          </div>
        </div>
      );
    }
  }
  return <div />;
};
