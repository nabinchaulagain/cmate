import React from "react";
import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";
const Checkbox = props => {
  return (
    <span
      onClick={props.onClick}
      className={`checkbox ${props.checked ? "checked" : "unchecked"} ${
        props.variant === "dark" ? " checkbox-dark" : ""
      } `}
      style={props.style}
    >
      {props.checked && <MdCheckBox />}
      {!props.checked && <MdCheckBoxOutlineBlank />}
    </span>
  );
};
export default Checkbox;
