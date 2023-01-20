import { useState, useEffect } from "react";

import AppTable from "../../global/AppTable";
import AppSlideOverPanel from "../../global/AppSlideOverPanel";
import AppNotification from "../../global/AppNotification";
import AppButton from "../../global/AppButton";
import AppModal from "../../global/AppModal";

import EditFilter from "./EditFilter";
import AddFilter from "./AddFilter";

import { useMutation } from "@apollo/client";

import { UPDATE_ONE_APP } from "../../../graphql/dashboard/tags-and-filters/app.query";
import { useTranslation } from "react-i18next";

const ListOfFilters = (props) => {
  const { t } = useTranslation();
  const { app_id } = props;
  
  const [filters, setFilters] = useState(null);
  const headers = [t("filter"), t("tags"), t("action")];

  const [sliderTitle, setSlideTitle] = useState("");
  const [sliderContent, setSlideContent] = useState("");
  const [sliderOpen, setSliderOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModaltitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [modalFooter, setModalFooter] = useState("");

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationContent, setNotificationContent] = useState("");
  const [notificationTitle, setNotificationTitle] = useState("");

  const [deletedIndex, setDeletedIndex] = useState("");

  const [deleteFilter, { data, loading, error }] = useMutation(UPDATE_ONE_APP, {
    onCompleted(data) {
      if (data.updateOneApp) {                       
        let newFilters = [...data.updateOneApp.filters].filter((s, sidx) => deletedIndex !== sidx);
        setFilters(newFilters);        
        setModalOpen(false);
        setNotificationOpen(true);
        setNotificationContent(t("tags-and-filters.removed_filter"));
        setNotificationTitle(t("deleted"));
      }
    },
  });

  useEffect(() => {
    if (!filters && props) {
      setFilters(props.filters);
    }
  }, [props]);

  const handleClickEditFilter = (item) => (e) => {
    let index = filters.indexOf(item);

    setSliderOpen(true);
    setSlideTitle(t("tags-and-filters.edit"));
    setSlideContent(
      <EditFilter
        setFilters={setFilters}
        filters={filters}
        filter={item}
        index={index}
        app_id={app_id}
        setSliderOpen={setSliderOpen}
        setNotificationOpen={setNotificationOpen}
        setNotificationTitle={setNotificationTitle}
        setNotificationContent={setNotificationContent}
      />
    );
  };

  const handleClickAddFilter = (e) => {
    setSliderOpen(true);
    setSlideTitle(t("tags-and-filters.add"));
    setSlideContent(
      <AddFilter
        setFilters={setFilters}
        filters={filters}
        app_id={app_id}
        setSliderOpen={setSliderOpen}
        setNotificationOpen={setNotificationOpen}
        setNotificationTitle={setNotificationTitle}
        setNotificationContent={setNotificationContent}
      />
    );
  };
  
  const handleClickDeleteFilter = (item) => (e) => {
    let index = filters.indexOf(item);

    setModalOpen(true);
    const title = t("delete");
    setModaltitle(title);
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
          handleClick={handleConfirmDeleteFilter(index)}
        />
      </div>
    );
    setModalFooter(footer);
  };

  const handleConfirmDeleteFilter = (index) => async (e) => {
    setDeletedIndex(index);
    let newFilters = filters.filter((s, sidx) => index !== sidx);

    const query = {
      _id: app_id,
    };
    const set = newFilters;
    console.log('elset')
    console.log(set)

    deleteFilter({
      variables: {
        query: query,
        set: {
          filters: set,
        },
      },
    });
  };

  // CD (JD on 20210908):
  // Return an add filter buttonn if the filter is null
  if (filters == null)
    return (
      <>
        <br />
        <AppSlideOverPanel
          isOpen={sliderOpen}
          setIsOpen={setSliderOpen}
          title={sliderTitle}
          content={sliderContent}
        />
        <AppNotification
          isOpen={notificationOpen}
          setIsOpen={setNotificationOpen}
          content={notificationContent}
          title={notificationTitle}
        />
        <AppModal
          isOpen={modalOpen}
          setIsOpen={setModalOpen}
          content={modalContent}
          title={modalTitle}
          footer={modalFooter}
        />
        <AppButton
          label={t("tags-and-filters.add_button")}
          className="primary"
          handleClick={handleClickAddFilter}
        />
      </>
    );
  return (
    <div>
      <AppSlideOverPanel
        isOpen={sliderOpen}
        setIsOpen={setSliderOpen}
        title={sliderTitle}
        content={sliderContent}
      />
      <AppNotification
        isOpen={notificationOpen}
        setIsOpen={setNotificationOpen}
        content={notificationContent}
        title={notificationTitle}
      />
      <AppModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        content={modalContent}
        title={modalTitle}
        footer={modalFooter}
      />
      <br />
      <AppButton
        label={t("tags-and-filters.add_button")}
        className="primary"
        handleClick={handleClickAddFilter}
      />
      <AppTable
        headers={headers}
        items={[]}
        name={t("filters")}
        total={filters.length}
      >
        {filters &&
          filters.map((item, index) => {
            return (
              <tr className="bg-white" key={index}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                  {item.title}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                  {/* {OptionsListItems(item.options)} */}
                  {item.tags.map((tag, index) => (
                    <li key={index}>{tag}</li>
                  ))}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                  <a href="#"
                    className="cursor-pointer"
                    onClick={handleClickEditFilter(item)}
                  >
                    {t("edit")}
                  </a>
                  &nbsp; &nbsp;
                  <a href="#"
                    className="cursor-pointer"
                    onClick={handleClickDeleteFilter(item)}
                  >
                    {t("delete")}
                  </a>
                </td>
              </tr>
            );
          })}
      </AppTable>
    </div>
  );
};

export default ListOfFilters;
