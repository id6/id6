import React from "react";
import id6Logo from "../../images/logo.svg";

export function AppLogo({ logo, className }: {
  logo: string;
  className?
}) {
  return (
    <img
      src={logo || id6Logo}
      className={className}
      alt="logo"
    />
  )
}
