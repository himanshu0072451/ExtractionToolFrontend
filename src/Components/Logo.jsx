import React from "react";

const Logo = ({ color }) => {
  return (
    <div className="top h-[40px]">
      <div className="logo h-full w-full">
        <img className={`${color === "white" ? "invert" : null}`} src="/logo1.svg" alt="LOGO!" />
      </div>
    </div>
  );
};

export default Logo;
