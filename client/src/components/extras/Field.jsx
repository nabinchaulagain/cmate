import React, { useRef } from "react";
const Field = ({ type, className, placeholder, error, name, value }) => {
  const fieldRef = useRef(null);
  let inputFieldDimensions;
  if (fieldRef.current) {
    inputFieldDimensions = fieldRef.current.getBoundingClientRect();
  }
  return (
    <React.Fragment>
      <input
        className={className}
        placeholder={placeholder}
        type={type}
        ref={fieldRef}
        defaultValue={value}
        name={name}
        autoComplete="off"
      />
      {error && (
        <div
          style={{
            position: "fixed",
            top: inputFieldDimensions.top + inputFieldDimensions.height - 7,
            left: inputFieldDimensions.left + 10
          }}
        >
          <small className="form-field-error p-0">{error}</small>
        </div>
      )}
    </React.Fragment>
  );
};

export default Field;
