import React, { useState } from "react";
import { Modal } from "react-bootstrap";
const ModalComp = props => {
  const [isModalActive, setModalActive] = useState(false);
  return (
    <React.Fragment>
      <span
        className={props.openButton.className}
        onClick={() => setModalActive(true)}
        id={props.openButton.id}
      >
        {props.openButton.text}
      </span>
      <Modal show={isModalActive} onHide={() => setModalActive(false)}>
        <Modal.Header closeButton>
          <h5>{props.modalHeading}</h5>
        </Modal.Header>
        <Modal.Body className="text-center">{props.modalBody}</Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default ModalComp;
