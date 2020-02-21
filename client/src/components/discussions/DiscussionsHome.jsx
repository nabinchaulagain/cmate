import React from "react";
import { getQuestions } from "../../actions/disccusions";
import { useSelector, useDispatch } from "react-redux";
import renderLoading from "../extras/renderLoading";
import QuestionCard from "./QuestionCard";
import QuestionForm from "./QuestionForm";
import { Helmet } from "react-helmet";
const DiscussionsHome = () => {
  const { questions, serverError, nextPage, currPage } = useSelector(
    state => state.discussions
  );
  const { isLoggedIn } = useSelector(state => state.auth);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(getQuestions());
  }, [dispatch]);
  React.useEffect(() => {
    let fetched = false;
    const scrollHandler = () => {
      const lastQuestion = document.querySelector(
        ".card.p-2.mb-2:last-of-type"
      );
      if (
        lastQuestion.offsetTop + lastQuestion.clientHeight <
        window.pageYOffset + window.innerHeight
      ) {
        if (currPage !== nextPage && !fetched) {
          dispatch(getQuestions(nextPage));
          fetched = true;
        }
      }
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [questions, currPage, dispatch, nextPage]);
  if (!questions) {
    return renderLoading("Loading questions.....");
  }
  return (
    <div className="col-md-7 col-sm-9 mt-2 mx-auto">
      <Helmet>
        <title>Discussions - Cmate</title>
        <meta name="description" content="Discussion about CMAT Exam" />
      </Helmet>
      {isLoggedIn && !showAddForm && (
        <div className="text-right mb-2">
          <button
            className={`btn btn-sm btn-info`}
            onClick={() => {
              setShowAddForm(true);
            }}
          >
            Ask a question
          </button>
        </div>
      )}
      {showAddForm && (
        <QuestionForm
          serverError={serverError}
          hideForm={() => {
            setShowAddForm(false);
          }}
        />
      )}
      {Object.keys(questions).map(question => (
        <QuestionCard
          question={questions[question].question}
          user={questions[question].user}
          created_at={questions[question].created_at}
          description={questions[question].description}
          key={questions[question]._id}
          images={questions[question].images}
          id={questions[question]._id}
          serverError={serverError && serverError[question]}
          votes={questions[question].votes}
        />
      ))}
    </div>
  );
};

export default DiscussionsHome;
