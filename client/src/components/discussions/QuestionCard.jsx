import React from "react";
import Modal from "../extras/Modal";
import QuestionModal from "./QuestionModal";
import { useSelector, useDispatch } from "react-redux";
import { deleteQuestion } from "../../actions/disccusions";
import flashMessage from "../../utils/flashMessage";
import { ProfilePicReusable } from "../extras/ProfilePic";
import QuestionForm from "./QuestionForm";
import Votes from "./QuestionVotes";
const QuestionCard = ({
  id,
  question,
  description,
  created_at,
  user,
  images,
  serverError,
  votes
}) => {
  const [showEditForm, setShowEditForm] = React.useState(false);
  if (showEditForm) {
    return (
      <QuestionForm
        serverError={serverError}
        initialValues={{ question, description, images }}
        type="edit"
        id={id}
        hideForm={() => {
          setShowEditForm(false);
        }}
      />
    );
  }
  return (
    <div className="card p-2 mb-2" style={{ background: "#dedede" }}>
      <div className="row">
        <div style={{ width: "auto", marginLeft: 10 }}>
          <Votes votes={votes} questionId={id} />
        </div>
        <div className="col-md-9 col-8">
          <h5 style={{ height: "auto", marginBottom: -5 }}>{question}</h5>
          <small style={{ fontSize: "70%" }}>
            By <ProfilePicReusable size={10} user={user} />
            on {new Date(created_at).toLocaleString()}
          </small>
          <p className="mt-2">{description}</p>
        </div>
      </div>

      <Modal
        openButton={{
          text: "View Details",
          style: { fontSize: "60%" }
        }}
        size="xl"
        modalHeading={
          <div>
            {question}
            <div style={{ fontSize: "60%" }}>
              <ProfilePicReusable size={16} user={user} />
              {new Date(created_at).toLocaleString()}
            </div>
          </div>
        }
        modalBody={
          <QuestionModal
            description={description}
            images={images}
            id={id}
            title={question}
          />
        }
      />
      <QuestionActions
        id={id}
        initialValues={{ description, images, question }}
        setShowEditForm={setShowEditForm}
        user={user}
      />
    </div>
  );
};

const DeleteModalBody = props => {
  const dispatch = useDispatch();
  return (
    <div className="mt-4 text-center">
      <button
        className="btn btn-lg btn-danger mr-4"
        onClick={() => {
          dispatch(deleteQuestion(props.id));
          flashMessage(dispatch, "Question deleted successfully");
        }}
      >
        Yes
      </button>
      <button data-modal-close-button={true} className="btn btn-lg btn-success">
        No
      </button>
    </div>
  );
};

const QuestionActions = props => {
  const user = useSelector(state => state.auth.user);
  if (user && user._id === props.user._id) {
    return (
      <div className="text-right">
        <button
          className="btn btn-sm btn-warning mr-1"
          style={{ fontSize: "60%" }}
          onClick={() => {
            props.setShowEditForm(true);
          }}
        >
          EDIT
        </button>
        <Modal
          openButton={{
            text: "DELETE",
            style: { fontSize: "60%" },
            className: "btn btn-sm btn-danger"
          }}
          size="lg"
          modalHeading={"Are you sure you want to delete this question??"}
          modalBody={<DeleteModalBody id={props.id}></DeleteModalBody>}
        />
      </div>
    );
  }
  return <div />;
};

export default QuestionCard;
