import React from 'react';
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRouter } from 'next/router';

const Guides = ({ children }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const onClick = (url) => router.push(url) 
  return (
    <>
      <div className="max-w-3xl mx-auto">
        <div id="Guides" className="relative py-8 bg-white sm:py-12 lg:py-16">
          <div className="text-center">
            {/*<h2 className="text-lg font-semibold leading-6 tracking-wider text-gray-300 uppercase">
                  Pricing
                </h2>*/}
            <h1 className="block text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              {t("help_guides_support.help_guides")}
            </h1>
            {/*<p className="max-w-4xl mx-auto mt-3 text-xl text-gray-300 sm:mt-5 sm:text-2xl">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit
                  numquam eligendi quos odit doloribus molestiae voluptatum.
                </p>*/}
          </div>

          <ul className="space-y-3 py-16">
            <li className="bg-white shadow overflow-hidden rounded-md px-6 py-4">
              <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                <h3 className="text-sm font-semibold text-gray-800">
                  <a
                    onClick={() => onClick("/guides/how-to-get-mapbox-key")}
                    href="#"
                    className="hover:text-sky-500 focus:outline-none"
                  >
                    <span
                      className="absolute inset-0"
                      aria-hidden="true"
                    ></span>
                    {t("help_guides_support.how_to_get_mapbox_key.title")}
                  </a>

                  {/*<Link onClick={() => onClick("/guides/how-to-get-mapbox-key">
                        <a className=
                          {router.pathname == "/dashboard/admin/apps"}>
                           Extend touch target to entire panel
                          <span className="absolute inset-0" aria-hidden="true"></span>
                          How to Get Your Mapbox Key
                        </a>
                      </Link>*/}
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {t("help_guides_support.how_to_get_mapbox_key_answer")}
                </p>
              </div>
            </li>
            <li className="bg-white shadow overflow-hidden rounded-md px-6 py-4">
              <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                <h3 className="text-sm font-semibold text-gray-800">
                  <a
                    onClick={() => onClick("/guides/how-to-add-mapbox-key")}
                    href="#"

                    className="hover:text-sky-500 focus:outline-none"
                  >
                    {/* Extend touch target to entire panel */}
                    <span
                      className="absolute inset-0"
                      aria-hidden="true"
                    ></span>
                    {t("help_guides_support.how_to_add_mapbox_key.title")}
                  </a>
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {t("help_guides_support.how_to_add_mapbox_key_answer")}
                </p>
              </div>
            </li>
            <li className="bg-white shadow overflow-hidden rounded-md px-6 py-4">
              <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                <h3 className="text-sm font-semibold text-gray-800">
                  <a
                    onClick={() => onClick("/guides/why-mapbox-key-is-needed")}
                    href="#"

                    className="hover:text-sky-500 focus:outline-none"
                  >
                    {/* Extend touch target to entire panel */}
                    <span
                      className="absolute inset-0"
                      aria-hidden="true"
                    ></span>
                    {t("help_guides_support.why_do_you_need_mapbox_key.title")}
                  </a>
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {t("help_guides_support.why_do_you_need_mapbox_key_answer")}
                </p>
              </div>
            </li>
            <li className="bg-white shadow overflow-hidden rounded-md px-6 py-4">
              <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                <h3 className="text-sm font-semibold text-gray-800">
                  <a
                    onClick={() => onClick("/guides/how-to-create-a-map")}
                    href="#"

                    className="hover:text-sky-500 focus:outline-none"
                  >
                    {/* Extend touch target to entire panel */}
                    <span
                      className="absolute inset-0"
                      aria-hidden="true"
                    ></span>
                    {t("help_guides_support.how_to_create_map.title")}
                  </a>
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {t("help_guides_support.how_to_create_map_answer")}
                </p>
              </div>
            </li>
            <li className="bg-white shadow overflow-hidden rounded-md px-6 py-4">
              <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                <h3 className="text-sm font-semibold text-gray-800">
                  <a
                    onClick={() => onClick("/guides/how-to-add-map-to-shopify")}
                    href="#"

                    className="hover:text-sky-500 focus:outline-none"
                  >
                    {/* Extend touch target to entire panel */}
                    <span
                      className="absolute inset-0"
                      aria-hidden="true"
                    ></span>
                    {t("help_guides_support.add_to_shopify.title")}
                  </a>
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {t("help_guides_support.add_to_shopify_answer")}
                </p>
              </div>
            </li>
            {/* <li className="bg-white shadow overflow-hidden rounded-md px-6 py-4">
                  <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                    <h3 className="text-sm font-semibold text-gray-800">
                      <a onClick={() => onClick("/guides/how-to-add-map-to-wordpress" className="hover:text-sky-500 focus:outline-none">
                       Extend touch target to entire panel 
                        <span className="absolute inset-0" aria-hidden="true"></span>
                        How to add a Map to Wordpress
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                     Follow these steps to put a map in your Wordpress site.
                    </p>
                  </div>
                </li>*/}
            <li className="bg-white shadow overflow-hidden rounded-md px-6 py-4">
              <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                <h3 className="text-sm font-semibold text-gray-800">
                  <a
                    onClick={() => onClick("/guides/how-to-integrate-map-in-any-website")}
                    href="#"

                    className="hover:text-sky-500 focus:outline-none"
                  >
                    {/* Extend touch target to entire panel */}
                    <span
                      className="absolute inset-0"
                      aria-hidden="true"
                    ></span>
                    {t("help_guides_support.how_to_integrate.title")}
                  </a>
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {t("help_guides_support.how_to_integrate_answer")}
                </p>
              </div>
            </li>
            <li className="bg-white shadow overflow-hidden rounded-md px-6 py-4">
              <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                <h3 className="text-sm font-semibold text-gray-800">
                  <a
                    onClick={() => onClick("/guides/how-to-customize-map")}
                    href="#"

                    className="hover:text-sky-500 focus:outline-none"
                  >
                    {/* Extend touch target to entire panel */}
                    <span
                      className="absolute inset-0"
                      aria-hidden="true"
                    ></span>
                    {t("help_guides_support.how_to_customize_map.title")}
                  </a>
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {t("help_guides_support.how_to_customize_map_answer")}
                </p>
              </div>
            </li>
            <li className="bg-white shadow overflow-hidden rounded-md px-6 py-4">
              <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                <h3 className="text-sm font-semibold text-gray-800">
                  <a
                    onClick={() => onClick("/guides/how-to-preview-map")}
                    href="#"

                    className="hover:text-sky-500 focus:outline-none"
                  >
                    {/* Extend touch target to entire panel */}
                    <span
                      className="absolute inset-0"
                      aria-hidden="true"
                    ></span>
                    {t("help_guides_support.preview_map")}
                  </a>
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {t("help_guides_support.preview_map_answer")}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Guides;
