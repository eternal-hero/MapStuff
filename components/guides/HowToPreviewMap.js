import React from 'react';
import { useTranslation } from "react-i18next";

const HowToPreviewMap = ({ children }) => {
  const { t } = useTranslation();
  return (
    <>
      <div>
        <div
          id="HowToPreviewMap"
          className="relative py-8 bg-white sm:py-12 lg:py-16"
        >
          <div className="text-center">
            {/*<h2 className="text-lg font-semibold leading-6 tracking-wider text-gray-300 uppercase">
                  Pricing
                </h2>*/}
            <h1 className="block text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              {t("help_guides_support.how_to_preview_your_map.title")}
            </h1>
            {/*<p className="max-w-4xl mx-auto mt-3 text-xl text-gray-300 sm:mt-5 sm:text-2xl">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit
                  numquam eligendi quos odit doloribus molestiae voluptatum.
                </p>*/}
          </div>

          <div className="max-w-md px-4 mx-auto sm:max-w-4xl md:max-w-5xl sm:px-6 lg:px-8 lg:max-w-7xl">
            <div className="relative py-16 overflow-hidden bg-white">
              <div className="relative px-4 sm:px-6 lg:px-8">
                {/*<div className="mx-auto text-lg max-w-prose">
                        <h1>
                          <span className="block text-base font-semibold tracking-wide text-center text-indigo-600 uppercase">Introducing</span>
                          <span className="block mt-2 text-3xl font-extrabold leading-8 tracking-tight text-center text-gray-900 sm:text-4xl">How to Create a Map</span>
                        </h1>                
                      </div>*/}
                <div className="mx-auto mt-6 prose text-gray-500 prose-indigo prose-md">
                  <p>
                    {t("help_guides_support.how_to_preview_your_map.step_1")}
                  </p>
                  <p>
                    <p>
                      {t("help_guides_support.how_to_preview_your_map.step_2")}
                    </p>{" "}
                  </p>
                  <ol className="list-inside">
                    <li>
                      {" "}
                      <p>
                        {t(
                          "help_guides_support.how_to_preview_your_map.step_3"
                        )}
                      </p>
                    </li>
                    <li>
                      {" "}
                      <p>
                        {t(
                          "help_guides_support.how_to_preview_your_map.step_4"
                        )}
                      </p>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowToPreviewMap;
