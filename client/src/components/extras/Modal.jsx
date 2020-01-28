import React, { useState, useRef, useEffect, useCallback } from "react";
import { Modal } from "react-bootstrap";

const ModalComp = props => {
  const [isModalActive, setModalActive] = useState(false);
  const closeModal = useCallback(() => {
    setModalActive(false);
  }, []);
  const modalBodyRef = useRef(null);
  useEffect(() => {
    attachClose(modalBodyRef, closeModal);
    //detach on component unmount
    return detachClose(modalBodyRef, closeModal);
  }, [isModalActive, closeModal, modalBodyRef]);
  return (
    <React.Fragment>
      <span
        className={props.openButton.className}
        onClick={() => setModalActive(true)}
        id={props.openButton.id}
        style={props.openButton.style}
      >
        {props.openButton.text}
      </span>
      <Modal
        show={isModalActive}
        onHide={() => setModalActive(false)}
        className={props.modalClass}
        size={props.size || "md"}
        className={props.className}
      >
        <Modal.Header closeButton>
          <h5>{props.modalHeading}</h5>
        </Modal.Header>
        <Modal.Body
          className="text-center"
          ref={modalBodyRef}
          style={{ background: "#ebebeb" }}
        >
          {props.modalBody}
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};
//attach close event listener to appropriate buttons in body of modal
const attachClose = (modalBodyRef, closeModal) => {
  if (modalBodyRef.current) {
    const modalBody = modalBodyRef.current;
    try {
      modalBody
        .querySelector("[data-modal-close-button]")
        .addEventListener("click", closeModal);
    } catch (err) {}
  }
};

//detach close event listener to appropriate buttons in body of modal
const detachClose = (modalBodyRef, closeModal) => {
  return () => {
    try {
      modalBodyRef.current
        .querySelector("[data-modal-close-button]")
        .removeEventListener("click", closeModal);
    } catch (err) {}
  };
};

export default ModalComp;
