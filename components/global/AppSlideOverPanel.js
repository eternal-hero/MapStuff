import { Transition } from "@headlessui/react";

const AppSlideOverPanel = (props) => {
  const { isOpen, setIsOpen, content, title } = props;

  return (
    <Transition
      show={isOpen}
      enter="ease-in-out duration-500"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in-out duration-500"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {/* <!--
          Background overlay, show/hide based on slide-over state.
    
          Entering: "ease-in-out duration-500"
            From: "opacity-0"
            To: "opacity-100"
          Leaving: "ease-in-out duration-500"
            From: "opacity-100"
            To: "opacity-0"
        --> */}
      <div
        className="absolute inset-0 transition-opacity bg-gray-500 bg-opacity-75"
        aria-hidden="true"
      ></div>
      <section
        className="absolute inset-y-0 right-0 flex max-w-full pl-10"
        aria-labelledby="slide-over-heading"
      >
        {/* <!--
            Slide-over panel, show/hide based on slide-over state.
    
            Entering: "transform transition ease-in-out duration-500 sm:duration-700"
              From: "translate-x-full"
              To: "translate-x-0"
            Leaving: "transform transition ease-in-out duration-500 sm:duration-700"
              From: "translate-x-0"
              To: "translate-x-full"
          --> */}

        <div className="w-screen max-w-2xl">
          <div className="flex flex-col h-full py-6 overflow-y-scroll bg-white shadow-xl">
            <Transition
              show={isOpen}
              enter="ease-in-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2
                    id="slide-over-heading"
                    className="text-lg font-medium text-gray-900"
                  >
                    {title}
                  </h2>
                  <div className="flex items-center ml-3 h-7">
                    <button
                      onClick={() => {
                        setIsOpen(!isOpen);
                      }}
                      className="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <span className="sr-only">Close panel</span>
                      {/* <!-- Heroicon name: x --> */}
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
                </div>
              </div>
              <div className="relative flex-1 px-4 mt-6 sm:px-6">
                {/* <!-- Replace with your content --> */}
                <div className="absolute inset-0 px-4 sm:px-6">
                  <div
                    className="h-full"
                    aria-hidden="true"
                  >
                    {content}
                  </div>
                </div>
                {/* <!-- /End replace --> */}
              </div>
            </Transition>
          </div>
        </div>
      </section>
    </Transition>
  );
};

export default AppSlideOverPanel;
