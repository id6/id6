import React from "react";
import logo from "../../images/logo.svg";

export function Id6Logo({ className }: {
  className?
}) {
  return (
    <img
      src={logo}
      className={className}
      alt="logo"
    />
  )
}
