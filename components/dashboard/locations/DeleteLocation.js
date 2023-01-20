import AppButton from "../../global/AppButton";
import { useMutation } from "@apollo/client";

import { LOCATION_DELETE } from "../../../graphql/dashboard/locations/location.query";
import { useTranslation } from "react-i18next";

const DeleteLocation = (props) => {
  const { item, locations, setModalOpen, setLocations } = props;
  const { t } = useTranslation();

  const [deleteLocation, { data, loading, error }] = useMutation(
    LOCATION_DELETE,
    {
      onCompleted(data) {
        let deletedIndex = locations.indexOf(item);
        let newLocations = locations.filter(
          (location, index) => deletedIndex !== index
        );
        setLocations(newLocations);
        setModalOpen(false);
      },
    }
  );

  const handleConfirmDeleteLocation = (e) => {
    console.log("click");
    let query = {
      _id: item._id,
    };

    deleteLocation({
      variables: {
        query: query,
      },
    });
  };
  return (
    <AppButton
      label={t("confirm")}
      className="primary"
      disabled={loading}
      handleClick={handleConfirmDeleteLocation}
    />
  );
};

export default DeleteLocation;
