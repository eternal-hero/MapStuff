import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useTranslation } from "react-i18next";

const AppIntegrations = ({ children }) => {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <>
      <div>
        <div className="mt-8">
          <h2 className="text-lg font-medium leading-6 text-gray-900">
            {t("integrations.title")}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {t("integrations.subtitle")}
          </p>

          <div className="grid grid-cols-1 gap-4 mt-2 sm:grid-cols-3">
            {/*<div className="relative flex items-center px-6 py-5 space-x-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sky-500">*/}
              {/*<div className="flex-shrink-0">
                    <img className="w-10 h-10 rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                  </div>*/}
              {/*<div className="flex-1 min-w-0">
                <div
                  onClick={() =>
                    router.push("/guides/how-to-add-map-to-shopify")
                  }
                  className="cursor-pointer focus:outline-none"
                >
                  <span className="absolute inset-0" aria-hidden="true"></span>
                  <p className="text-sm font-medium text-gray-900">
                    {t("integrations.shopify")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t("integrations.shopify_link")}
                  </p>
                </div>
              </div>*/}
            {/*</div>*/}

            {/*<div className="relative flex items-center px-6 py-5 space-x-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sky-500">*/}
            {/*<div className="flex-shrink-0">
                    <img className="w-10 h-10 rounded-full" src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                  </div>*/}
            {/*<div className="flex-1 min-w-0">
                    <a href="/guides/how-to-add-map-to-wordpress" className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true"></span>
                      <p className="text-sm font-medium text-gray-900">
                        WordPress
                      </p>
                      <p className="text-sm text-gray-500">
                        Add to any widget or page
                      </p>
                    </a>
                  </div>
                </div>*/}

            <div className="relative flex items-center px-6 py-5 space-x-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sky-500">
              {/*<div className="flex-shrink-0">
                    <img className="w-10 h-10 rounded-full" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                  </div>*/}
              <div className="flex-1 min-w-0">
                <div
                  onClick={() =>
                    router.push("/guides/how-to-integrate-map-in-any-website")
                  }
                  className="cursor-pointer focus:outline-none"
                >
                  <span className="absolute inset-0" aria-hidden="true"></span>
                  <p className="text-sm font-medium text-gray-900">
                    {t("integrations.platform")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t("integrations.platform_subtitle")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppIntegrations;
