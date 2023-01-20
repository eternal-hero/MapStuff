import { useRouter } from "next/router";
import { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// Create Context object.
const TranslationContext = createContext();

// Export Provider.
export function TranslationWrapper({ children }) {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (language !== "") {
      localStorage.setItem("language", language);
      handleLocaleChange(language);
    }
  }, [language]);

  const handleLocaleChange = (lg) => {
    router.push(router.route, router.asPath, {
      locale: lg,
    });
  };

  useEffect(() => {
    setLanguage(router.locale);
    i18n.changeLanguage(router.locale);
  }, [router.locale]);

  return (
    <TranslationContext.Provider
      value={{
        language,
        setLanguage,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

// Export useContext Hook.
export function useTranslationContext() {
  return useContext(TranslationContext);
}
