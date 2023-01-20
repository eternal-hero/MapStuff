import { useTranslation } from "react-i18next";

import React from "react";

const Features = ({ children }) => {
  const { t } = useTranslation();
  return (
    <>
      <div>
        <div id="Features" className="relative py-8 bg-white sm:py-12 lg:py-16">
          <div className="max-w-md px-4 mx-auto text-center sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl">
            <h2 className="text-base font-semibold tracking-wider uppercase text-sky-600">
              {t("features.title")}
            </h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {t("features.description")}
            </p>
            <p className="mx-auto mt-5 text-xl text-gray-500 max-w-prose">
              {t("features.subtitle")}
            </p>
            <div className="mt-12">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="pt-6">
                  <div className="flow-root px-6 pb-8 rounded-lg bg-gray-50">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 rounded-md shadow-lg bg-sky-500">
                          {/* Heroicon name: cloud-upload */}
                          <svg
                            className="w-6 h-6 text-white"
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
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">
                        {t("features.mobile_friendly")}
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        {t("features.mobile_friendly_subtitle")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flow-root px-6 pb-8 rounded-lg bg-gray-50">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 rounded-md shadow-lg bg-sky-500">
                          {/* Heroicon name: lock-closed */}
                          <svg
                            className="w-6 h-6 text-white"
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
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">
                        {t("features.tailored_map")}
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        {t("features.tailored_map_subtitle")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flow-root px-6 pb-8 rounded-lg bg-gray-50">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 rounded-md shadow-lg bg-sky-500">
                          {/* Heroicon name: refresh */}
                          <svg
                            className="w-6 h-6 text-white"
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
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">
                        {t("features.no_developer")}
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        {t("features.no_developer_subtitle")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flow-root px-6 pb-8 rounded-lg bg-gray-50">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 rounded-md shadow-lg bg-sky-500">
                          {/* Heroicon name: shield-check */}
                          <svg
                            className="w-6 h-6 text-white"
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
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">
                        {t("features.intuitive_dashboard")}
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        {t("features.Intuitive_dashboard_subtitle")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flow-root px-6 pb-8 rounded-lg bg-gray-50">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 rounded-md shadow-lg bg-sky-500">
                          {/* Heroicon name: cog */}
                          <svg
                            className="w-6 h-6 text-white"
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
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">
                        {t("features.easy_to_follow")}
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        {t("features.easy_to_follow_subtitle")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flow-root px-6 pb-8 rounded-lg bg-gray-50">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 rounded-md shadow-lg bg-sky-500">
                          {/* Heroicon name: server */}
                          <svg
                            className="w-6 h-6 text-white"
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
                              d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                            />
                          </svg>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">
                        {t("features.integrate_platform")}
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        {t("features.integrate_platform_subtitle")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Features;
