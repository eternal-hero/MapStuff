import React, { Component } from "react";

const AppButton = ({ label, className, handleClick, type, disabled }) => {
  if (className == "primary")
    className =
      "inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm whitespace-nowrap bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500";
  else if (className == "primary-full")
    className =
      "block w-full px-4 py-2 text-sm font-medium text-center text-white border border-transparent rounded-md shadow-sm whitespace-nowrap bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500";
  else if (className == "secondary")
    className =
      "inline-flex items-center px-4 py-2 text-sm font-medium border border-transparent rounded-md whitespace-nowrap text-sky-700 bg-sky-100 hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500";
  else if (className == "tertiary")
    className =
      "inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm whitespace-nowrap hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500";


    const disabledClassName =
    "inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm whitespace-nowrap bg-gray-400 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500";
      return (
    <button
      type={type ? type : "button"}
      className={disabled? disabledClassName: className}
      onClick={handleClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default AppButton;

{
  /* AppButton for 3 "styles" Primary, Secondary, Tertiary. Please use styles listed below.`

<button type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-sky-500 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
  Primary
</button>

<button type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium border border-transparent rounded-md text-sky-700 bg-sky-100 hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
  Secondary
</button>

<button type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
  Tertiary
</button>

*/
}
