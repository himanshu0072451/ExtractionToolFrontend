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




import React from "react";

const Logo = ({ color }) => {
  return (
    <div className="top h-[40px] w-[150px]">
      <img
        src={`${import.meta.env.BASE_URL}logo1.svg`}
        alt="hello!"
        className={`${color === "white" ? "invert" : ""} h-full w-full object-contain`}
      />
    </div>
  );
};

export default Logo;

