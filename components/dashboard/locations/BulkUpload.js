import { useMutation } from "@apollo/client";
import React, { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { LOCATION_INSERT_MANY } from "../../../graphql/dashboard/locations/location.query";
import AppButton from "../../global/AppButton";
import AppTable from "../../global/AppTable";
import UpgradePlanModalContent from "./UpgradePlanModalContent";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

function StyledDropzone(props) {
  const {
    app_id,
    setModalOpen,
    setModaltitle,
    setModalContent,
    setModalFooter,
    locationsLimit,
    currentLocations,

    setNotificationOpen,
    setNotificationContent,
    setNotificationTitle,
    refetch,

    session,
  } = props;

  let locationsCount = currentLocations.filter((location) => {
    return location.status == "Published";
  }).length;
  const { t } = useTranslation();

  const headers = [
    t("street"),
    t("city"),
    t("zip_code"),
    t("state_province"),
    t("contact_number"),
    t("email"),
    t("website_url"),
    t("location_name"),
    t("status"),
    t("geometry"),
  ];

  const [bulkLocations, setBulkLocations] = useState([]);
  const [insertManyLocation, { data, loading, error }] = useMutation(
    LOCATION_INSERT_MANY,
    {
      onCompleted(data) {
        if (data.insertManyLocations) {
          refetch();
          setModalOpen(false);
          setNotificationOpen(true);
          setNotificationContent(<p>Your new locations has been added!</p>);
          setNotificationTitle(t("submitted"));
          setBulkLocations([]);
        }
      }
    }
  );

  const handleConfirmBulkUpdate = (e) => {
    console.log("click");
    insertManyLocation({
      variables: {
        data: bulkLocations,
      },
    });
  };
  const handleClickBulkUpload = (e) => {
    setModalOpen(true);
    setModaltitle(t("general.bulk_upload.title"));
    const content = <p>{t("general.are_you_sure")}</p>;
    setModalContent(content);
    const footer = (
      <div>
        <AppButton
          label={t("cancel")}
          className="tertiary"
          handleClick={() => setModalOpen(false)}
        />
        &nbsp; &nbsp;
        <AppButton
          label={t("confirm")}
          className="primary"
          handleClick={handleConfirmBulkUpdate}
        />
      </div>
    );
    setModalFooter(footer);
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      setBulkLocations([]);
      if (acceptedFiles.length) {
        var file = acceptedFiles[0];
        var name = file.name;
        const reader = new FileReader();

        reader.onload = async (evt) => {
          // evt = on_file_select event
          /* Parse data */
          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, { type: "binary" });
          /* Get first worksheet */
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          /* Convert array of arrays */
          const data = XLSX.utils.sheet_to_json(ws, { skipHeader: true });
          /* Update state */

          // let locationsCount = data.length + currentLocations;

          console.log("plan limit: " + locationsLimit);
          console.log("current location count: " + locationsCount);
          console.log(locationsLimit > locationsCount);
          if (locationsLimit > locationsCount || locationsLimit == 0) {
            const locations = data.map(async (location) => {
              var street = location[t("street")];
              var city = location[t("city")];
              var postalCode = location[t("zip_code")];
              var state = location[t("state_province")];
              var country = location[t("country")];

              var phone = location[t("contact_number")];
              var email = location[t("email")];
              var url =
                location["Website URL (start with https:// or http://)"];
              var name = location[t("location_name")];


              var base_url =
                "https://api.mapbox.com/geocoding/v5/mapbox.places/";
              var location_address =
                encodeURIComponent(street) +
                ", " +
                encodeURIComponent(city) +
                " ," +
                encodeURIComponent(state) +
                ", " +
                encodeURIComponent(postalCode) +
                ".json?";

              var parameters =
                "types=address&access_token=" + process.env.MAPBOX_ACCESS_TOKEN;
              var query = base_url + location_address + parameters;

              var res = await fetch(query);
              var data = await res.json();

              var geometry =
                data.features.length !== 0
                  ? {
                      type: "Point",
                      coordinates: [
                        data.features[0].geometry.coordinates[1],
                        data.features[0].geometry.coordinates[0],
                      ],
                    }
                  : {
                      type: "Point",
                      coordinates: [0, 0],
                    };

              return {
                app_id: app_id,
                created_by_id: session.sub.replace("auth0|", ""),
                properties: {
                  address: street,
                  city: city,
                  postalCode: postalCode,
                  state: state,
                  phone: phone,
                  email: email,
                  country: country,
                  url: url,
                },
                name: name,
                dateModified: "",
                status: "Unpublished",
                type: "Feature",
                dateAdded: "",
                geometry: geometry,
                tags: [],
              };
            });
            try {
              const results = await Promise.all(locations);
              setBulkLocations(results);
            } catch (e) {}
          } else {
            setModalOpen(true);
            const title = "Max locations uploaded";
            setModaltitle(title);
            setModalContent(<UpgradePlanModalContent />);
          }
        };
        reader.readAsBinaryString(file);
      }
    },
    [locationsCount]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept:
      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
  });
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  return (
    <div className="container">
      <br />
      <a
        href="https://cdn.gangnam.club/templates/mapstuff-locations-template.xlsx"
        download
      >
        {t("general.bulk_upload.xlsx")}
      </a>
      <br />
      <a
        href="https://cdn.gangnam.club/templates/mapstuff-locations-template.csv"
        download
      >
        {t("general.bulk_upload.csv")}
      </a>
      <br />
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>{t("general.bulk_upload.drop_content")}</p>
      </div>
      <br />
      {bulkLocations.length > 0 && (
        <div>
          {t("general.bulk_upload.upload_confirmation")}
          <AppTable headers={headers} items={[]}>
            {bulkLocations.map((item, index) => {
              return (
                <tr className="bg-white" key={index}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {item?.properties?.address}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {item?.properties?.city}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {item?.properties?.postalCode}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {item?.properties?.state}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {item?.properties?.phone}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {item?.properties?.email}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {item?.properties?.url}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {item?.name}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {item?.status}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {item?.geometry?.coordinates.map((coordinates, key) => {
                      return <li key={key}>{coordinates}</li>;
                    })}
                  </td>
                </tr>
              );
            })}
          </AppTable>
          <br />
          <br />
          <AppButton
            className="primary"
            label={t("general.bulk_upload.header")}
            handleClick={handleClickBulkUpload}
          />
        </div>
      )}
    </div>
  );
}

export default StyledDropzone;
