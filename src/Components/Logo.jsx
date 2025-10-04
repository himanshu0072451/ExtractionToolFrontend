import React from "react";
import logo from "@/assets/logo1.svg"; // path relative to src

const Logo = ({ color }) => {
  return (
    <div className="top h-[40px]">
      <div className="logo h-full w-full">
        <img className={`${color === "white" ? "invert" : ""}`} src={logo} alt="LOGO!" />
      </div>
    </div>
  );
};

export default Logo;
