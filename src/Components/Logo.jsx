// import React from "react";

// const Logo = ({ color }) => {
//   return (
//     <div className="top h-[40px]">
//       <div className="logo h-full w-full">
//         <img
//           className={`${color === "white" ? "invert" : ""}`}
//           src={`${import.meta.env.BASE_URL}logo1.svg`}
//           alt="LOGO!"
//         />
//       </div>
//     </div>
//   );
// };

// export default Logo;



const Logo = () => {
  return (
    <img
      src="https://himanshu0072451.github.io/ExtractionToolFrontend/logo1.svg"
      alt="LOG!"
      style={{ width: "150px", height: "40px" }}
    />
  );
};

export default Logo;


