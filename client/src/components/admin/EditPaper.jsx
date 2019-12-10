import React, { useEffect, useState } from "react";
import PaperForm from "./PaperForm";
import axios from "axios";
import { useDispatch } from "react-redux";
import renderLoading from "../extras/renderLoading";
//function for inital state of questions
const EditPaper = props => {
  const [initialValues, setIntialValues] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const getAndSetInitialState = async () => {
      try {
        const response = await axios.get(
          `/api/admin/getPaper/${props.match.params.id}`
        );
        setIntialValues(response.data);
      } catch (err) {
        window.location.href = "/admin";
      }
    };
    getAndSetInitialState();
  }, []);
  if (!initialValues) {
    return <React.Fragment>{renderLoading("Loading ....")}</React.Fragment>;
  }
  return (
    <PaperForm
      initialQuestions={initialValues}
      type="edit"
      id={props.match.params.id}
      dispatch={dispatch}
    />
  );
};

export default EditPaper;
