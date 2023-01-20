import { useRouter } from "next/router";
import React from "react";
import { useTranslation } from "react-i18next";

const HelpGuidesAndSupport = ({ children }) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      {/*Same content as with /component/guides/Guides but with no different bg color and each link opens to new tab here */}
      <div className="max-w-3xl mx-auto">
        <div id="Guides" className="relative py-8">
          <div className="text-center">
            <h1 className="block text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              {t("help_guides_support.help_guides")}
            </h1>
            {/*<p className="max-w-4xl mx-auto mt-3 text-xl text-gray-300 sm:mt-5 sm:text-2xl">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit
                  numquam eligendi quos odit doloribus molestiae voluptatum.
                </p>*/}
          </div>

          <ul className="py-16 space-y-3">
            <li className="px-6 py-4 overflow-hidden bg-white rounded-md shadow focus-within:ring-2 focus-within:ring-sky-500">
              <div className="relative">
                <h3 className="text-sm font-semibold text-gray-800 cursor-pointer">
                  <div
                    onClick={() => router.push("/guides/how-to-get-mapbox-key")}
                    className="hover:text-sky-500 focus:outline-none"
                  >
                    <span
                      className="absolute inset-0"
                      aria-hidden="true"
                    ></span>
                    {t("help_guides_support.how_to_get_mapbox_key.title")}
                  </div>

                  {/*<div href="/guides/how-to-get-mapbox-key">
                        <a className=
                          {router.pathname == "/dashboard/admin/apps"}>
                           Extend touch target to entire panel
                          <span className="absolute inset-0" aria-hidden="true"></span>
                          How to Get Your Mapbox Key
                        </a>
                      </div>*/}
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {t("help_guides_support.how_to_get_mapbox_key_answer")}
                </p>
              </div>
            </li>
            <li className="px-6 py-4 overflow-hidden bg-white rounded-md shadow focus-within:ring-2 focus-within:ring-sky-500">
              <div className="relative">
                <h3 className="text-sm font-semibold text-gray-800 cursor-pointer">
                  <div
                    onClick={() => router.push("/guides/how-to-add-mapbox-key")}
                    className="hover:text-sky-500 focus:outline-none"
                  >
                    {/* Extend touch target to entire panel */}
                    <span
                      className="absolute inset-0"
                      aria-hidden="true"
                    ></span>
                    {t("help_guides_support.how_to_add_mapbox_key.title")}
                  </div>
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {t("help_guides_support.how_to_add_mapbox_key_answer")}
                </p>
              </div>
            </li>
            <li className="px-6 py-4 overflow-hidden bg-white rounded-md shadow focus-within:ring-2 focus-within:ring-sky-500">
              <div className="relative">
                <h3 className="text-sm font-semibold text-gray-800 cursor-pointer">
                  <div
                    onClick={() =>
                      router.push("/guides/why-mapbox-key-is-needed")
                    }
                    className="hover:text-sky-500 focus:outline-none"
                  >
                    {/* Extend touch target to entire panel */}
                    <span
                      className="absolute inset-0"
                      aria-hidden="true"
                    ></span>
                    {t("help_guides_support.why_do_you_need_mapbox_key.title")}
                  </div>
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {t("help_guides_support.why_do_you_need_mapbox_key_answer")}
                </p>
              </div>
            </li>
            <li className="px-6 py-4 overflow-hidden bg-white rounded-md shadow focus-within:ring-2 focus-within:ring-sky-500">
              <div className="relative">
                <h3 className="text-sm font-semibold text-gray-800 cursor-pointer">
                  <div
                    onClick={() => router.push("/guides/how-to-create-a-map")}
                    className="hover:text-sky-500 focus:outline-none"
                  >
                    {/* Extend touch target to entire panel */}
                    <span
                      className="absolute inset-0"
                      aria-hidden="true"
                    ></span>
                    {t("help_guides_support.how_to_create_map.title")}
                  </div>
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {t("help_guides_support.how_to_create_map_answer")}
                </p>
              </div>
            </li>
            <li className="px-6 py-4 overflow-hidden bg-white rounded-md shadow focus-within:ring-2 focus-within:ring-sky-500">
              <div className="relative">
                <h3 className="text-sm font-semibold text-gray-800 cursor-pointer">
                  <div
                    onClick={() =>
                      router.push("/guides/how-to-add-map-to-shopify")
                    }
                    className="hover:text-sky-500 focus:outline-none"
                  >
                    {/* Extend touch target to entire panel */}
                    <span
                      className="absolute inset-0"
                      aria-hidden="true"
                    ></span>
                    {t("help_guides_support.add_to_shopify.title")}
                  </div>
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {t("help_guides_support.add_to_shopify_answer")}
                </p>
              </div>
            </li>
            {/* <li className="px-6 py-4 overflow-hidden bg-white rounded-md shadow focus-within:ring-2 focus-within:ring-sky-500">
                  <div className="relative">
                    <h3 className="text-sm font-semibold text-gray-800 cursor-pointer">
                      <a href="/guides/how-to-add-map-to-wordpress" className="hover:text-sky-500 focus:outline-none">
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
            <li className="px-6 py-4 overflow-hidden bg-white rounded-md shadow focus-within:ring-2 focus-within:ring-sky-500">
              <div className="relative">
                <h3 className="text-sm font-semibold text-gray-800 cursor-pointer">
                  <div
                    onClick={() =>
                      router.push("/guides/how-to-integrate-map-in-any-website")
                    }
                    className="hover:text-sky-500 focus:outline-none"
                  >
                    {/* Extend touch target to entire panel */}
                    <span
                      className="absolute inset-0"
                      aria-hidden="true"
                    ></span>
                    {t("help_guides_support.how_to_integrate.title")}
                  </div>
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {t("help_guides_support.how_to_integrate_answer")}
                </p>
              </div>
            </li>
            <li className="px-6 py-4 overflow-hidden bg-white rounded-md shadow focus-within:ring-2 focus-within:ring-sky-500">
              <div className="relative">
                <h3 className="text-sm font-semibold text-gray-800 cursor-pointer">
                  <div
                    onClick={() => router.push("/guides/how-to-customize-map")}
                    className="hover:text-sky-500 focus:outline-none"
                  >
                    {/* Extend touch target to entire panel */}
                    <span
                      className="absolute inset-0"
                      aria-hidden="true"
                    ></span>
                    {t("help_guides_support.how_to_customize_map.title")}
                  </div>
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {t("help_guides_support.how_to_customize_map_answer")}
                </p>
              </div>
            </li>
            <li className="px-6 py-4 overflow-hidden bg-white rounded-md shadow focus-within:ring-2 focus-within:ring-sky-500">
              <div className="relative">
                <h3 className="text-sm font-semibold text-gray-800 cursor-pointer">
                  <div
                    onClick={() => router.push("/guides/how-to-preview-map")}
                    className="hover:text-sky-500 focus:outline-none"
                    target="_blank"
                  >
                    {/* Extend touch target to entire panel */}
                    <span
                      className="absolute inset-0"
                      aria-hidden="true"
                    ></span>
                    {t("help_guides_support.preview_map")}
                  </div>
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

export default HelpGuidesAndSupport;

export async function getServerSideProps(context) {
  const { req } = context;

  if (req) {
    let host = req.headers.host; // will give you localhost:3000

    return {
      props: { host },
    };
  }
}
