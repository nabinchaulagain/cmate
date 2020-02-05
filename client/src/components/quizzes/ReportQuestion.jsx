import React from "react";
import Modal from "../extras/Modal";
import axios from "axios";
import history from "../../history";
import { useDispatch } from "react-redux";
import flashMessage from "../../utils/flashMessage";
const ReportQuestion = ({ questionNum }) => {
  return (
    <Modal
      openButton={{
        text: "Report Question",
        style: { fontSize: "70%" },
        className: "btn btn-sm btn-danger"
      }}
      size="lg"
      modalHeading="Report question"
      modalBody={<ReportForm questionNum={questionNum} />}
    />
  );
};

const ReportForm = ({ questionNum }) => {
  const [description, setDescription] = React.useState(null);
  const [error, setError] = React.useState(null);
  const quizId = /\/(\w+)$/.exec(history.location.pathname)[1];
  const dispatch = useDispatch();
  const handleSubmit = async event => {
    event.preventDefault();
    if (!description) {
      return setError("Description is required");
    }
    try {
      await axios.post(`/api/report/${quizId}?questionNum=${questionNum}`, {
        description
      });
      flashMessage(dispatch, "Reported");
      document.querySelector("[data-modal-close-button]").click();
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      }
    }
  };
  return (
    <form className="col-10 mx-auto" onSubmit={handleSubmit}>
      <textarea
        id="report-description"
        className="form-control"
        rows="5"
        placeholder="Describe what's wrong with this question"
        onChange={event => {
          setDescription(event.target.value);
          if (!event.target.value) {
            return setError("Description is required");
          }
          setError(null);
        }}
      >
        {description}
      </textarea>
      {error && <small className="text-danger">{error}</small>}
      <div data-modal-close-button="true"></div>
      <div className="mt-2">
        <input type="submit" className="btn btn-info" value="Report" />
      </div>
    </form>
  );
};
export default ReportQuestion;
