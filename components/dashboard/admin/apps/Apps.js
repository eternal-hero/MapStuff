import React, { Component, useState, useEffect } from "react";
import Link from "next/link";

import { APPS_QUERY } from "../../../../graphql/dashboard/admin/apps/app.query";
import { APP_UPDATE_ONE_MUTATION } from "../../../../graphql/dashboard/admin/apps/app.mutation";

import { useQuery, useMutation } from "@apollo/client";
import AppButton from "../../../global/AppButton";
import AppSlideOverPanel from "../../../global/AppSlideOverPanel";
import AppForm from "../../../../components/global/AppForm";
import AppNotification from "../../../../components/global/AppNotification"
import { APP_QUERY } from "../../../../graphql/dashboard/admin/apps/app.query";
import EditApp from "./EditApp";
import ViewApp from "./ViewApp";
function Apps(props) {
  /* CD (EV on 20200204): declare session*/
  const { session } = props;
  const { loading, error, data } = useQuery(APPS_QUERY);
  /* CD (EV on 20200204): Slider Panel props*/
  const [isOpen, setIsOpen] = useState(false);

  /* CD (EV on 20200204): App Notif*/
  const [isSuccess, setIsSuccess] = useState(false);
  const [appNotifContent, setAppNotifContent] = useState(null);
  const [appNotifTitle, setAppNotifTitle] = useState(null);

  const [app_id, setAppId] = useState(null);

  const [slideTitle, setSlideTitle] = useState("");
  const [slideContent, setSlideContent] = useState("");

  const handleClickEditLocation = (id) => (props) => {
    setIsOpen(!isOpen);
    setSlideTitle("Edit app details");
    setSlideContent(
      <EditApp
        id={id}
        setIsOpen={setIsOpen}
        setIsSuccess={setIsSuccess}
        setAppNotifContent={setAppNotifContent}
        setAppNotifTitle={setAppNotifTitle}
      />
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return (
    <>
      <AppNotification
        isOpen={isSuccess}
        setIsOpen={setIsSuccess}
        content={appNotifContent}
        title={appNotifTitle}
      />
      <AppSlideOverPanel
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={slideTitle}
        content={slideContent}
      />

      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
              <Link href={"/dashboard/admin/apps/add"}>
                <div className="mb-4">
                  <AppButton className="primary" label="Add" />
                </div>
              </Link>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      APP URL
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      PLAN
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.apps.map(({ _id, app_url }) => {
                    return (
                      <tr key={_id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {_id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{app_url}</div>
                        </td>
                        <td></td>
                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                          <a href="#"
                            className="text-sky-600 hover:text-sky-900 hover:cursor-pointer"
                            onClick={() => {
                              setIsOpen(!isOpen);
                              setSlideTitle("View app details");
                              setSlideContent(
                                <ViewApp id={_id} session={session} />
                              );
                            }}
                          >
                            View
                          </a>
                          &nbsp;&nbsp;
                          <a
                            href="#"
                            className="text-sky-600 hover:text-sky-900 hover:cursor-pointer"
                            onClick={handleClickEditLocation(_id)}
                          >
                            Edit
                          </a>
                          &nbsp;&nbsp;
                          <Link
                            href={
                              "/dashboard/admin/apps/" + app_url + "/locations"
                            }
                          >
                            <span className="text-sky-600 hover:text-sky-900 hover:cursor-pointer">
                              Locations
                            </span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Apps;
// class Apps extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//   }
//   render() {
//     return (
//       <>
//         <Link href={"/dashboard/admin/apps/add"}>
//           <div className="mb-4">
//             <AppButton className="primary" label="Add" />
//           </div>
//         </Link>
//         <FetchApps />
//       </>
//     );
//   }
// }

// export default Apps;
