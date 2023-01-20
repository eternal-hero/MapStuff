import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

const HowToGetMapboxKey = ({ children }) => {
  const { t } = useTranslation();
  return (
    <>
      <div>
        <div
          id="HowToGetMapboxKey"
          className="relative py-8 bg-white sm:py-12 lg:py-16"
        >
          <div className="text-center">
            {/*<h2 className="text-lg font-semibold leading-6 tracking-wider text-gray-300 uppercase">
                  Pricing
                </h2>*/}
            <h1 className="block text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              {t("help_guides_support.how_to_get_mapbox_key.title")}
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
                          <span className="block mt-2 text-3xl font-extrabold leading-8 tracking-tight text-center text-gray-900 sm:text-4xl">How to Add Mapbox Key</span>
                        </h1>
                      </div>*/}
                <div className="mx-auto mt-6 prose text-gray-500 prose-indigo prose-md">
                  <ol className="list-inside">
                    <li>
                      {t("help_guides_support.how_to_get_mapbox_key.step_1")}
                      <Link
                        href="https://account.mapbox.com/auth/signup/"
                        title="Sign up for Mapbox account"
                      >
                        {t("help_guides_support.how_to_get_mapbox_key.step_2")}
                      </Link>
                      .
                    </li>
                    <li>
                      {t("help_guides_support.how_to_get_mapbox_key.step_3")}
                      <strong>
                        {" "}
                        {t("help_guides_support.how_to_get_mapbox_key.step_4")}
                      </strong>
                      .
                    </li>
                    <li>
                      {t("help_guides_support.how_to_get_mapbox_key.step_5")}
                      <strong>
                        {" "}
                        {t("help_guides_support.how_to_get_mapbox_key.step_6")}
                      </strong>
                      . {t("help_guides_support.how_to_get_mapbox_key.step_7")}
                      <img
                        src="https://cdn.gangnam.club/guides/how-to-get-mapbox-key-mapbox-token.png"
                        alt="mapbox token in the mapbox account"
                        className="rounded-md shadow-md"
                      />
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

export default HowToGetMapboxKey;
