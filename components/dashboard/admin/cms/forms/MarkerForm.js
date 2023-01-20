import { useState } from "react";
import { Switch } from "@headlessui/react";

const MarkerForm = (props) => {
  const [enabled, setEnabled] = useState(props.value);

  return (
    <>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${
          enabled ? "bg-blue-600" : "bg-gray-200"
        } ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue-500`}
      >
        <span className="sr-only">Enable notifications</span>
        <span
          aria-hidden="true"
          className={`${
            enabled ? "translate-x-5" : "translate-x-0"
          } translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
        />
      </Switch>
    </>
  );
};

export default MarkerForm;
