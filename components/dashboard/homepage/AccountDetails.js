import React, { useState } from "react";
import { APPS_COUNT_QUERY } from "../../../graphql/dashboard/homepage/app.query";

import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import Link from "next/link";

const AccountDetails = ({ children, session }) => {
  const { t } = useTranslation();
  const { loading, error, data } = useQuery(APPS_COUNT_QUERY, {
    variables: {
      input: {
        created_by_id: session.user.sub.replace("auth0|", ""),
      },
    },
  });

  if (loading || !data) return <p>{t("loading")}.</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div>
        <h2 className="text-lg font-medium leading-6 text-gray-900">
          {t("account_details.title")}
        </h2>
        <div className="grid grid-cols-1 gap-5 mt-2 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card */}

          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {/* Heroicon name: code */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <div className="flex-1 w-0 ml-5">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t("account_details.app_name")}
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {data?.apps[0]?.app_url == session.user.sub
                          ? "App name is not set yet"
                          : data.apps[0]?.app_url}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-gray-50">
              <div className="text-sm">
                <Link
                  href="/dashboard/map-settings"
                  className="font-medium text-cyan-700 hover:text-cyan-900"
                >
                  {t("account_details.update_url")}
                </Link>
              </div>
            </div>
          </div>

          {/* Card */}

          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {/* Heroicon name: cards */}
                  <svg
                    className="w-6 h-6 text-red-500"
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
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <div className="flex-1 w-0 ml-5">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t("account_details.edit_subscription")}
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {session.user.plan && session.user.plan.nickname
                          ? session.user.plan.nickname
                          : "NO PLAN"}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-gray-50">
              <div className="text-sm">
                <Link
                  href="/dashboard/plans"
                  className="font-medium text-cyan-700 hover:text-cyan-900"
                >
                  {t("account_details.upgrade_plan")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountDetails;
