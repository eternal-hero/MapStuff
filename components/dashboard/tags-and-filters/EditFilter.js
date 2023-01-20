import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import AppFormField from "../../global/AppFormField";
import AppButton from "../../global/AppButton";
import { UPDATE_ONE_APP } from "../../../graphql/dashboard/tags-and-filters/app.query";
import { useTranslation } from "react-i18next";
const EditFilter = (props) => {
  const {
    filters,
    filter,
    setFilters,

    index,
    app_id,

    setSliderOpen,

    setNotificationOpen,
    setNotificationTitle,
    setNotificationContent,
  } = props;
  const { t } = useTranslation();

  const [title, setTitle] = useState(filter.title);

  const [tags, setTags] = useState(filter.tags);

  console.log(app_id);
  const [updateFilter, { data, loading, error }] = useMutation(UPDATE_ONE_APP, {
    onCompleted(data) {
      if (data.updateOneApp) {
        let newFilters = [...filters]; // copying the old datas array
        newFilters[index] = {
          tags: data.updateOneApp.filters[index].tags,
          title: data.updateOneApp.filters[index].title,
        };
        setFilters(newFilters);
        setSliderOpen(false);

        setNotificationOpen(true);
        setNotificationContent(t("tags-and-filters.saved"));
        setNotificationTitle(t("saved"));
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

  async function handleClickSaveFilter(e) {
    e.preventDefault();
    let newFilters = [...filters]; // copying the old datas array
    newFilters[index] = {
      title: title,
      tags: tags,
    };

    const query = {
      _id: app_id,
    };
    const set = newFilters;

    updateFilter({
      variables: {
        query: query,
        set: {
          filters: set,
        },
      },
    });

    console.log("save");
  }

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

export default EditFilter;
