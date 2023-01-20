import React from "react";

const TextInput = (props) => {
  return (
    <div>
      <label htmlFor="">
        {props.label}
        <input
          className="flex-1 block w-full border-gray-300 rounded-none rounded-md focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
          type={props.type ? props.type : "text"}
          value={props.value}
          onChange={props.onChange}
          required={props.required}
        />
      </label>
    </div>
  );
};

export default TextInput;
