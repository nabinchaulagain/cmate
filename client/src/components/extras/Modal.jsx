import React, { useState,useRef,useEffect,useCallback } from "react";
import { Modal } from "react-bootstrap";
const ModalComp = props => {
  const [isModalActive, setModalActive] = useState(false);  
  const closeModal= useCallback(()=>{setModalActive(false)},[])
  const modalBodyRef= useRef(null);
  useEffect(()=>{
    attachClose(modalBodyRef,closeModal);
    //detach on component unmount
    return detachClose(modalBodyRef,closeModal)
  },[isModalActive,closeModal,modalBodyRef])
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
        <Modal.Body className="text-center" ref={modalBodyRef}>{props.modalBody}</Modal.Body>
      </Modal>
    </React.Fragment>
  );
};
//attach close event listener to appropriate buttons in body of modal
const attachClose = (modalBodyRef,closeModal)=>{
  if(modalBodyRef.current){
    const modalBody = modalBodyRef.current;
    try{
      modalBody.querySelector("button.btn.btn-danger.btn-md").addEventListener("click",closeModal);
    }
    catch(err){

    }
  }
  
}
//detach close event listener to appropriate buttons in body of modal

const detachClose = (modalBodyRef,closeModal)=>{
  return()=>{
    try{
      modalBodyRef.current.querySelector("button.btn.btn-danger.btn-md").removeEventListener("click",closeModal);
    }
    catch(err){
    
    }
  }
}

export default ModalComp;
