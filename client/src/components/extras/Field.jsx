import React from "react";
const Field = ({ type, className, placeholder, error, name, value }) => {
  return (
    <React.Fragment>
      <input
        className={className}
        placeholder={placeholder}
        type={type}
        defaultValue={value}
        name={name}
        autoComplete="off"
      />
      {error && (
        <div className="form-field-error text-left">
          <small className="ml-3">{error}</small>
        </div>
      )}
    </React.Fragment>
  );
};

export default Field;
