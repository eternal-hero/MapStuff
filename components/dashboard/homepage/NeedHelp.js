import { useTranslation } from "react-i18next";

import React from "react";
import Link from "next/link";

const NeedHelp = ({ children }) => {
  const { t } = useTranslation();
  return (
    <>
      <div>
        <div className="py-8">
          <h2 className="text-lg font-medium leading-6 text-gray-900">
            {t("need_help.title")}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {t("need_help.subtitle")}{" "}
            <Link href="mailto:support@mapstuff.io">
              <span className="hover:text-sky-500">{t("need_help.email")}</span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default NeedHelp;
