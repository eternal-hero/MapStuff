/* CD (EV on 20200204): import React  */
import React, { Component, useState } from "react";
/* CD (EV on 20200204): import APPS_QUERY graphql */
import { APPS_QUERY } from "../../../graphql/dashboard/apps/app.query";
/* CD (EV on 20200204): import useQuery apollo client */
import { useQuery } from "@apollo/client";
/* CD (EV on 20200204): import AppSlideOverPanel Component */
import AppSlideOverPanel from "../../../components/global/AppSlideOverPanel";

/* CD (EV on 20200204): import Edit and View App Component */
import EditApp from "./EditApp";
import ViewApp from "./ViewApp";
import Link from "next/link";
/* CD (EV on 20200204): end Import Edit and View App Component */
function FetchApps(props) {
  /* CD (EV on 20200204): fetch session variable*/
  const { session } = props;

  /* CD (EV on 20200204): declare initial AppSlideOverPanel props*/
  const [isOpen, setIsOpen] = useState(false);
  const [slideTitle, setSlideTitle] = useState("");
  const [slideContent, setSlideContent] = useState("");

  /* CD (EV on 20200204): fetch apps*/
  const { loading, error, data } = useQuery(APPS_QUERY, {
    variables: {
      input: { created_by_id: session.user._id },
    },
  });

  /* CD (EV on 20200204): redeclare EditApp as EditForm */
  const EditForm = ({ id }) => {
    return <EditApp app_id={id} session={session} />;
  };
  /* CD (EV on 20200204): redeclare ViewApp as ViewForm */
  const ViewForm = ({ id }) => {
    return <ViewApp app_id={id} session={session} />;
  };

  /* CD (EV on 20200204): waiting apps to fetch*/
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div className="flex flex-col">
      {/* CD (EV on 20200204): AppSlideOverPanel initial declaration*/}
      <AppSlideOverPanel
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={slideTitle}
        content={slideContent}
      />
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
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
                        {/* CD (EV on 20200204): Click View App*/}
                        <a  href="#"
                          className="text-sky-600 hover:text-sky-900 hover:cursor-pointer"
                          onClick={() => {
                            {
                              /* CD (EV on 20200204): Open Slider*/
                            }
                            setIsOpen(!isOpen);
                            {
                              /* CD (EV on 20200204): Change Slider panel Title*/
                            }
                            setSlideTitle("View app details");
                            {
                              /* CD (EV on 20200204): Change Slider panel Content*/
                            }
                            setSlideContent(<ViewForm id={_id} />);
                          }}
                        >
                          View
                        </a>
                        &nbsp;&nbsp;
                        <a  href="#"
                          onClick={() => {
                            {
                              /* CD (EV on 20200204): Open Slider*/
                            }
                            setIsOpen(!isOpen);
                            {
                              /* CD (EV on 20200204): Change Slider panel Title*/
                            }
                            setSlideTitle("Edit app details");
                            {
                              /* CD (EV on 20200204): Change Slider panel Content*/
                            }
                            setSlideContent(<EditForm id={_id} />);
                          }}
                          className="text-sky-600 hover:text-sky-900 hover:cursor-pointer"
                        >
                          Edit
                        </a>
                        &nbsp;&nbsp;
                        {/* CD (EV on 20200204): Redirect to Locations*/}
                        <Link
                          className="text-sky-600 hover:text-sky-900 hover:cursor-pointer"
                          href={"/dashboard/apps/" + app_url + "/locations"}
                        >
                          Locations
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
  );
}

class Apps extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <Link
          className="text-sky-600 hover:text-sky-900 hover:cursor-pointer"
          href={"/dashboard/apps/add"}
        >
          ADD
        </Link>

        <FetchApps session={this.props.session} />
      </div>
    );
  }
}

export default Apps;
