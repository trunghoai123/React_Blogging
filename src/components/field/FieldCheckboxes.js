import React from "react";

const FieldCheckboxes = ({ children, className }) => {
  return <div className={`flex flex-wrap gap-5 ${className}`}>{children}</div>;
};

export default FieldCheckboxes;
