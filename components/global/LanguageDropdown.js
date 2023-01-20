import React from "react";
import Select from "react-select";
import { useTranslationContext } from "../context/TranslationContext";

const options = [
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
];

export const LanguageDropdown = () => {
  const { language, setLanguage } = useTranslationContext();
  return (
   

    <div className="mt-12 xl:mt-0">
      <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Language</h3>
      <form className="mt-4 sm:max-w-xs">
        <fieldset className="w-full">
          <label for="language" className="sr-only">Language</label>
          <div className="relative">
            {/* <select id="language" name="language" className="appearance-none block w-full bg-none bg-gray-700 border border-transparent rounded-md py-2 pl-3 pr-10 text-base text-white focus:outline-none focus:ring-white focus:border-white sm:text-sm">
              <option selected>English</option>
              <option>French</option>
            </select> */}
            <Select
              style={{ width: 200 }}
              name="tags"
              value={options.find((val) => val.value === language)}
              onChange={(e) => setLanguage(e.value)}
              options={options}
              id="dropdown"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 px-2 flex items-center">
              
              <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </fieldset>
      </form>
    </div> 




  );
};
