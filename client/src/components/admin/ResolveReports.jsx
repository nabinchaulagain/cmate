import React from "react";
import FieldComps from "./AddPaper/FormFields";
import axios from "axios";
import { ProfilePicReusable } from "../extras/ProfilePic";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";
import { validate } from "./AddPaper/QuestionForm";
import flashMessage from "../../utils/flashMessage";
import { useDispatch } from "react-redux";
import history from "../../history";
const ResolveReports = props => {
  const [state, setState] = React.useState({
    initialValues: { options: {} },
    errors: {}
  });
  const dispatch = useDispatch();
  React.useEffect(() => {
    const initializeState = async () => {
      try {
        const { data } = await axios.get(
          `/api/admin/getReports/${props.match.params.paperId}?questionNum=${props.match.params.questionNum}`
        );
        setState({
          ...state,
          initialValues: data.initialValues,
          reports: data.reports
        });
      } catch (err) {
        console.log(err.response);
        if (err.response && err.response.status === 400) {
          window.location.href = "/admin/reports";
        }
      }
    };
    initializeState();
  }, [props, state]);
  if (Object.keys(state.initialValues.options).length === 4) {
    return (
      <div className="mt-3 mb-2">
        <h2 className="text-center col-12">
          Resolve {state.reports.length} Reports
        </h2>
        <ReportList reports={state.reports} />
        <form
          className="col-lg-6 col-md-7 col-sm-9 text-center bg-dark text-light p-4 mt-2 mx-auto"
          style={{ borderRadius: 5 }}
          onSubmit={event =>
            handleSubmit(
              event,
              errors => setState({ ...state, errors }),
              props.match.params.paperId,
              props.match.params.questionNum,
              dispatch,
              state.initialValues
            )
          }
        >
          <h3>Question No. {props.match.params.questionNum}</h3>
          <FieldComps
            initialValues={state.initialValues}
            errors={state.errors}
            setImageInState={() => {}}
          />
          <input type="submit" value="Resolve" className="btn btn-success" />
        </form>
      </div>
    );
  }
  return null;
};
const ReportList = ({ reports }) => {
  const [showReports, setShowReports] = React.useState(false);
  return (
    <div
      className="col-lg-6 col-md-7 col-sm-9 text-center mt-2 mx-auto"
      style={{ borderRadius: 10 }}
    >
      <span
        onClick={() => {
          setShowReports(!showReports);
        }}
        style={{ cursor: "pointer" }}
      >
        Show Reports
        {showReports && <IoMdArrowDropdown size={28} />}
        {!showReports && <IoMdArrowDropright size={28} />}
      </span>
      {showReports &&
        reports.map(report => {
          return (
            <div className="alert alert-warning text-justify" key={report.id}>
              <ProfilePicReusable user={report.reporter} size={22} />
              <p>{report.description}</p>
            </div>
          );
        })}
    </div>
  );
};

const handleSubmit = async (
  event,
  setErrors,
  paperId,
  questionNum,
  dispatch,
  initialValues
) => {
  event.preventDefault();
  const form = event.target;
  const question = form.querySelector("input[name='question']").value;
  const a = form.querySelector('input[name="a"]').value;
  const b = form.querySelector('input[name="b"]').value;
  const c = form.querySelector('input[name="c"]').value;
  const d = form.querySelector('input[name="d"]').value;
  const directionImage = form.querySelector('input[name="direction_image"]');
  const directionImageEnd = form.querySelector(
    'input[name="direction_image_upto"]'
  );
  const questionImageDisplay = form.querySelector("#question_imagedisplay");
  const directionImageDisplay = form.querySelector("#direction_imagedisplay");
  let directionText = form.querySelector("input[name='direction']");
  const directionUpto = form.querySelector("input[name='direction_upto']");
  const image = form.querySelector("input[name='question_image']");
  let correctOption;
  form.querySelectorAll("input[name='correctOption']").forEach(radioBox => {
    if (radioBox.checked) {
      correctOption = radioBox;
    }
    return;
  });
  const formValues = { question, options: { a, b, c, d }, correctOption };
  if (directionText && directionUpto) {
    formValues.direction = {
      text: directionText.value,
      ending: directionUpto.value
    };
  }
  let directionImgBlob;
  let questionImgBlob;
  let directionBlobEnd;
  if (
    directionImage &&
    directionImageEnd &&
    directionImageEnd.value &&
    directionImage.files[0]
  ) {
    directionImgBlob = directionImage.files[0];
    directionBlobEnd = directionImageEnd.value;
  } else {
    if (directionImageDisplay) {
      formValues.directionImage = initialValues.directionImage;
    }
  }
  if (correctOption) {
    formValues.correctOption = correctOption.value;
  }
  if (image && image.files[0]) {
    questionImgBlob = image.files[0];
  } else {
    if (questionImageDisplay) {
      formValues.image = initialValues.image;
    }
  }
  const errors = validate(formValues);
  //if no errors
  if (Object.keys(errors).length !== 0) {
    return setErrors(errors);
  } else {
    const requestBody = getRequestBody(
      formValues,
      directionImgBlob,
      directionBlobEnd,
      questionImgBlob
    );
    await axios.post(
      `/api/admin/resolveReports/${paperId}?questionNum=${questionNum}`,
      requestBody
    );
    history.push("/admin");
    flashMessage(dispatch, "Report resolved");
  }
};

const getRequestBody = (
  formValues,
  directionImgBlob,
  directionImageEnd,
  imageBlob
) => {
  const formData = new FormData();
  formData.append("question", JSON.stringify(formValues));
  formData.append(`directionImage_to_${directionImageEnd}`, directionImgBlob);
  formData.append("image", imageBlob);
  return formData;
};

export default ResolveReports;
