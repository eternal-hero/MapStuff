/* CD (EV on 20200213): import useEffect & useRef react module*/
import { useEffect, useRef } from "react";
/* CD (EV on 20200213): import Transition headlessui/react*/
import { Transition } from "@headlessui/react";
/* CD (EV on 20200213): import useRouter*/
import { useRouter } from "next/router";
const AppModal = (props) => {
  /* CD (EV on 20200213): declare modal props*/
  const { isOpen, setIsOpen, content, title, footer } = props;
  /* CD (EV on 20200213): initialize ref*/
  const ref = useRef(null);

  const router = useRouter();

  useEffect(() => {
    /* CD (EV on 20200213): create handleEscape function*/
    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    /* CD (EV on 20200213): create handleEscape function*/
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    /* CD (EV on 20200213): create handleEscape function*/
    document.addEventListener("keyup", handleEscape);
    document.addEventListener("click", handleClickOutside, true);
    /* CD (EV on 20200213): when unmount remove event listener*/
    return () => {
      document.removeEventListener("keyup", handleEscape);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <Transition
      show={isOpen}
      enter-active-classname="duration-300 ease-out"
      enter-from-classname="opacity-0"
      enter-to-classname="opacity-100"
      leave-active-classname="duration-200 ease-in"
      leave-from-classname="opacity-100"
      leave-to-classname="opacity-0"
    >
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          {/* <!--
          Background overlay, show/hide based on modal state.
    
          Entering: "ease-out duration-300"
            From: "opacity-0"
            To: "opacity-100"
          Leaving: "ease-in duration-200"
            From: "opacity-100"
            To: "opacity-0"
        --> */}
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          {/* <!-- This element is to trick the browser into centering the modal contents. --> */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          {/* <!--
          Modal panel, show/hide based on modal state.
    
          Entering: "ease-out duration-300"
            From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            To: "opacity-100 translate-y-0 sm:scale-100"
          Leaving: "ease-in duration-200"
            From: "opacity-100 translate-y-0 sm:scale-100"
            To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        --> */}
          <div
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all pb-6 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full "
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
            ref={ref}
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ">
              <div className="text-right">
                <button
                  onClick={() => setIsOpen(false)}
                  type="button"
                  className="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
                >
                  <span className="sr-only">Close menu</span>
                  {/* Heroicon name: x */}
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <h1>{title}</h1>
              <span style={{ display: "inline-block", width: "500px" }}></span>
              {content}
            </div>
            {footer ? (
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {footer}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      {/* mobile */}
    </Transition>
  );
};

export default AppModal;
