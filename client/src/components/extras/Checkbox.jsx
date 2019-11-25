import React from "react";
import {MdCheckBoxOutlineBlank,MdCheckBox} from "react-icons/md";
const Checkbox = props => {
  return (
    <span
      onClick={props.onClick}
      className={"checkbox " + (props.checked ? "checked" : "unchecked")}
    >
      {props.checked && <MdCheckBox/>}
      {!props.checked && <MdCheckBoxOutlineBlank/>}
    </span>
  );
};
export default Checkbox;
