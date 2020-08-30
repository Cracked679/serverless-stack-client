import React from "react";
import { Button } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";
import "./LoaderButton.css";

function LoaderButton({
  isLoading,
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <Button
      className={`LoaderButton ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <CircularProgress size={25} color="secondary" className="spinning" />
      )}
      {props.children}
    </Button>
  );
}

export default LoaderButton;
