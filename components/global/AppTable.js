// /* AppTable

import { useTranslation } from "react-i18next";

// Sample table can be found here:

// /components/dashboard/homepage/MappedLocationsPreview.js

// This component (MappedLocationsPreview.js) can also be updated to use the new "AppTable" component.

// */}

const AppTable = ({ headers, items, name, total, children }) => {
  const { t } = useTranslation();
  const th = headers.map((header, index) => (
    <th
      key={index}
      scope="col"
      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
    >
      {header}
    </th>
  ));
  var tr = [];

  if (items.length) {
    tr = items.map((item, index) => (
      <tr key={index} className="bg-white">
        {item.map((text, index) => {
          return (
            <td
              key={index}
              className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap"
            >
              {text}
            </td>
          );
        })}
      </tr>
    ));
  }

  return (
    <div className="flex flex-col mt-2">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>{th}</tr>
              </thead>
              <tbody>{items.length > 0 ? tr : children}</tbody>
            </table>
            {/* {items.length ? ( */}
            <nav
              className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6"
              aria-label="Pagination"
            >
              <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                  {t("showing")}
                  <span className="mx-1 font-medium">1</span>
                  {t("to")}
                  <span className="mx-1 font-medium">{total}</span>
                  {t("of")}

                  <span className="mx-1 font-medium">{total}</span>
                  {name}
                </p>
              </div>

              <div className="flex justify-between flex-1 sm:justify-end">
                {/* <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  View All
                </a> */}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppTable;
