import React from "react";
const Checkbox = props => {
  return (
    <span
      onClick={props.onClick}
      className={"checkbox " + (props.checked ? "checked" : "unchecked")}
    >
      {props.checked && <React.Fragment>&#128505;</React.Fragment>}
      {!props.checked && <React.Fragment>&#9744;</React.Fragment>}
    </span>
  );
};
export default Checkbox;
