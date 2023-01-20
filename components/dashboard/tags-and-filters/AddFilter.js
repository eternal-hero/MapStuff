import { useState } from "react";
import { useMutation } from "@apollo/client";

import AppFormField from "../../global/AppFormField";
import AppButton from "../../global/AppButton";
import { UPDATE_ONE_APP } from "../../../graphql/dashboard/tags-and-filters/app.query";
import { useTranslation } from "react-i18next";

const AddFilter = (props) => {
  const {
    filters,
    setFilters,

    app_id,

    setSliderOpen,

    setNotificationOpen,
    setNotificationTitle,
    setNotificationContent,
  } = props;

  const [title, setTitle] = useState("");
  const { t } = useTranslation();
  const [tags, setTags] = useState([""]);

  const [addFilter, { data, loading, error }] = useMutation(UPDATE_ONE_APP, {
    onCompleted(data) {
      if (data.updateOneApp) {
        //add checking if the variable is a array before spreading
        let newFilters = Array.isArray(filters) ? [...filters] : []; // copying the old datas array
        newFilters.push({
          tags: data.updateOneApp.filters[data.updateOneApp.filters.length - 1]
            .tags,
          title:
            data.updateOneApp.filters[data.updateOneApp.filters.length - 1]
              .title,
        });
        setFilters(newFilters);
        setSliderOpen(false);

        setNotificationOpen(true);
        setNotificationContent(t("tags-and-filters.new_filter_added"));
        setNotificationTitle(t("submitted"));
      }
    },
  });

  const updateTagOption = (index) => (e) => {
    let newArr = [...tags]; // copying the old datas array
    newArr[index] = e.target.value; // replace e.target.value with whatever you want to change it to
    setTags(newArr);
  };

  const handleClickAddOption = (e) => {
    setTags(tags.concat([""]));
  };

  const handleClickRemoveOption = (index) => (e) => {
    setTags(tags.filter((s, sidx) => index !== sidx));
  };

  const handleClickSaveFilter = (e) => {
    e.preventDefault();
    // CD (JD on 20210908):
    // Validate if the filter is null
    let newFilters = filters ? [...filters] : []; // copying the old datas array

    newFilters.push({
      tags: tags,
      title: title,
    });

    const query = {
      _id: app_id,
    };
    const set = newFilters;

    addFilter({
      variables: {
        query: query,
        set: {
          filters: set,
        },
      },
    });

    // setFilters(
    //   filters.concat({
    //     tags: tags,
    //     title: title,
    //   })
    // );
  };

  /* CD (JD on 20210827): Add invalidation when click is entered  */
  const invalidateEnterKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      return false;
    }
  };

  return (
    <div>
      <form
        onSubmit={handleClickSaveFilter}
        onKeyDown={(e) => invalidateEnterKey(e)}
      >
        <AppFormField
          value={title}
          label={t("filter")}
          onChange={(event) => setTitle(event.target.value)}
          required={true}
        />
        <div className="mt-5">
          <label htmlFor="">
            {t("tags")}
            {tags.map((tag, index) => (
              <div key={index}>
                <AppFormField
                  type="text"
                  value={tag}
                  onChange={updateTagOption(index)}
                  required={true}
                />
                {index == tags.length - 1 && (
                  <button
                    className="flex-shrink-0 px-2 py-1 text-sm text-teal-500 border-4 border-transparent rounded hover:text-teal-800"
                    type="button"
                    onClick={handleClickAddOption}
                  >
                    {t("add")}
                  </button>
                )}
                {tags.length > 1 && (
                  <button
                    className="flex-shrink-0 px-2 py-1 text-sm text-teal-500 border-4 border-transparent rounded hover:text-teal-800"
                    type="button"
                    onClick={handleClickRemoveOption(index)}
                  >
                    {t("remove")}
                  </button>
                )}

                {index == 0 && <br />}
              </div>
            ))}
          </label>
        </div>
        <div className="mt-5">
          <AppButton type="submit" label={t("save")} className="primary" />
        </div>
      </form>
    </div>
  );
};

export default AddFilter;
