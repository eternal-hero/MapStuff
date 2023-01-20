import { useState } from 'react'
import { Switch } from '@headlessui/react'

export default function AppToggle(props) {
  const { onChange, label } = props
  const [enabled, setEnabled] = useState(props.value)

  function myFunc() {
    setEnabled(!enabled)
    onChange(!enabled)
  }
  return (
    <div>
      <label htmlFor="">
        {label}
        <Switch
          checked={enabled}
          onChange={myFunc}
          className={`${enabled ? 'bg-toggle-primary' : 'bg-gray-200'}
        ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue-500`}
        >
          <span className="sr-only">Use setting</span>
          <span
            aria-hidden="true"
            className={`${
              enabled ? 'translate-x-5' : 'translate-x-0'
            } translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
          />
        </Switch>
      </label>
    </div>
  )
}

// import { useState } from "react";
// import { Switch } from "@headlessui/react";
// const AppToggle = (props) => {
//   const { onChange } = props;
//   const [enabled, setEnabled] = useState(props.value);
//   console.log(enabled);
//   function myFunc() {
//     setEnabled(!enabled);
//     onChange(!enabled);
//   }

//   return (
//     <Switch
//       checked={enabled}
//       onChange={myFunc}
//       className={`${
//         enabled ? "bg-blue-600" : "bg-gray-200"
//       } ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue-500`}
//     >
//       <span className="sr-only">Lorem Ipsum Dolor</span>
//       <span
//         aria-hidden="true"
//         className={`${
//           enabled ? "translate-x-5" : "translate-x-0"
//         } translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
//       />
//     </Switch>
//   );
// };

// export default AppToggle;
