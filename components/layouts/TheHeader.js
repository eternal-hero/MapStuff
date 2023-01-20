import { useState, useEffect } from "react";
import AppButton from "../global/AppButton";
import { Transition } from "@headlessui/react";
import Logo from "../global/logos/Logo";

import AppModal from "../../components/global/AppModal";
import RegistrationForm from "../../components/register/RegistrationForm";
import LoginForm from "../../components/login/LoginForm";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0";
import { LanguageDropdown } from "../global/LanguageDropdown";
import { useTranslation } from "react-i18next";

import Link from "next/link";
import { useTranslationContext } from "../context/TranslationContext";
const TheHeader = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { t } = useTranslation();
  const { language } = useTranslationContext()
  const [initialState, setInitialState] = useState("");

  const router = useRouter();
  const handleClickSignIn = (event) => {
    router.push("/api/auth/login");
    // setIsOpenModal(!isOpenModal);
    // setModalContent(<LoginForm />);
    // setModalTitle("Sign in");
    // setIsOpen(false);
  };

  const handleClickDashboard = (event) => {
    router.push("/dashboard");
  };

  const handleClickSignUp = (event) => {
    router.push("/api/signup");
  };

  const handleClickSignOut = () => {
    router.push("/api/auth/logout");

    // signOut({
    //   // The page where you want to redirect to after a
    //   // successful login
    //   callbackUrl: `${window.location.origin}`,
    // });
  };

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  // Allow to use the `esc` key
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (router.query.sigin == "true" && initialState != "signin") {
      console.log("sign in");
      setInitialState("signin");
      setIsOpenModal(true);
      setModalContent(<LoginForm />);
      setModalTitle("Sign in");
      setIsOpen(false);
    }

    document.addEventListener("keyup", handleEscape);
    return () => document.removeEventListener("keyup", handleEscape);
  }, [initialState]);


  return (
    <>
      <AppModal
        isOpen={isOpenModal}
        setIsOpen={setIsOpenModal}
        content={modalContent}
        title={modalTitle}
      />
      <div>
        <div className="relative bg-gray-50">
          <div className="relative bg-white shadow">
            <div className="px-4 mx-auto max-w-7xl sm:px-6">
              <div className="flex items-center justify-between py-6 md:justify-start md:space-x-10">
                <div className="flex justify-start lg:w-0 lg:flex-1">
                  <Logo />
                </div>
                <div className="-my-2 -mr-2 md:hidden">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    type="button"
                    className="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
                  >
                    <span className="sr-only">{t("header.open_menu")}</span>
                    {/* Heroicon name: menu */}
                    <svg
                      className="w-6 h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>
                <nav className="hidden space-x-10 md:flex">
                  <Link
                    href={router.pathname == "/" ? "/features" : "/features"}
                    className="text-base font-medium text-gray-500 hover:underline hover:text-sky-400 "
                  >
                    {t("header.features")}
                  </Link>
                  <Link
                    href={
                      router.pathname == "/"
                        ? "#Integrations"
                        : "/#Integrations"
                    }
                    className="text-base font-medium text-gray-500 hover:underline hover:text-sky-400 "
                  >
                    {t("header.integrations")}
                  </Link>
                  <Link
                    href={language === '' ? "/demo": `/${language}/demo`}
                    className="text-base font-medium text-gray-500 hover:underline hover:text-sky-400 "
                  >
                    {t("header.demo")}
                  </Link>
                  <Link
                    href={router.pathname == "/" ? "#Plans" : "/#Plans"}
                    className="text-base font-medium text-gray-500 hover:underline hover:text-sky-400 "
                  >
                    {t("header.plans")}
                  </Link>
                  <Link
                    href="/guides"
                    className="text-base font-medium text-gray-500 hover:underline hover:text-sky-400 "
                  >
                    {t("header.guides")}
                  </Link>
                </nav>
                <div className="items-center justify-end hidden space-x-3 md:flex md:flex-1 lg:w-0">
                  {!user && (
                    <>
                      <AppButton
                        label={t("header.signin")}
                        className="tertiary"
                        handleClick={handleClickSignIn}
                      />
                      <AppButton
                        label={t("sign_up")}
                        className="primary"
                        handleClick={handleClickSignUp}
                      />
                    </>
                  )}
                  {user && (
                    <>
                      <AppButton
                        label={t("dashboard.title")}
                        className="tertiary"
                        handleClick={handleClickDashboard}
                      />
                      <AppButton
                        label={t("sign_out")}
                        className="primary"
                        handleClick={handleClickSignOut}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
            <Transition
              show={isOpen}
              enter="duration-200 ease-out"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="duration-100 ease-in"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {/*
                    Mobile menu, show/hide based on mobile menu state.

                    Entering: "duration-200 ease-out"
                        From: "opacity-0 scale-95"
                        To: "opacity-100 scale-100"
                    Leaving: "duration-100 ease-in"
                        From: "opacity-100 scale-100"
                        To: "opacity-0 scale-95"
                    */}

              <Transition.Child className="fixed inset-0">
                <div className="fixed absolute inset-0 bg-gray-600 opacity-75" />
              </Transition.Child>

              <div className="absolute inset-x-0 top-0 z-10 p-2 transition origin-top-right transform md:hidden">
                <div className="bg-white divide-y-2 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 divide-gray-50">
                  <div className="px-5 pt-5 pb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Logo />
                      </div>
                      <div className="-mr-2">
                        <button
                          onClick={() => setIsOpen(!isOpen)}
                          type="button"
                          className="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
                        >
                          <span className="sr-only">
                            {t("header.close_menu")}
                          </span>
                          {/* Heroicon name: x */}
                          <svg
                            className="w-6 h-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="mt-6">
                      <nav className="grid gap-y-8">
                        {user && (
                          <a
                            href="#"
                            className="flex items-center p-3 -m-3 rounded-md hover:bg-gray-50"
                            onClick={() => {
                              setIsOpen(false);
                              router.push("/dashboard")
                            }}
                          >
                            {/* Heroicon name: cursor-click */}
                            <svg
                              className="flex-shrink-0 w-6 h-6 text-sky-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                              />
                            </svg>
                            <span className="ml-3 text-base font-medium text-gray-900">
                              {t("header.dashboard")}
                            </span>
                          </a>
                        )}

                        <a
                          href="#"
                          className="flex items-center p-3 -m-3 rounded-md hover:bg-gray-50"
                          onClick={() => {setIsOpen(false); router.push("/features")}}
                        >
                          {/* Heroicon name: cursor-click */}
                          <svg
                            className="flex-shrink-0 w-6 h-6 text-sky-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                            />
                          </svg>
                          <span className="ml-3 text-base font-medium text-gray-900">
                            {t("header.features")}
                          </span>
                        </a>

                        <a
                          href="#"
                          className="flex items-center p-3 -m-3 rounded-md hover:bg-gray-50"
                          onClick={() => {
                            setIsOpen(false)
                            router.push("/#Integrations")
                          }}
                        >
                          <svg
                            className="flex-shrink-0 w-6 h-6 text-sky-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                            />
                          </svg>
                          <span className="ml-3 text-base font-medium text-gray-900">
                            {t("header.integrations")}
                          </span>
                        </a>

                        <a
                           href={language === '' ? "/demo": `/${language}/demo`}
                          className="flex items-center p-3 -m-3 rounded-md hover:bg-gray-50"
                          onClick={() => setIsOpen(false)}
                        >
                          {/* Heroicon name: view-grid */}
                          <svg
                            className="flex-shrink-0 w-6 h-6 text-sky-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                            />
                          </svg>
                          <span className="ml-3 text-base font-medium text-gray-900">
                            {t("header.demo")}
                          </span>
                        </a>

                        <a
                          href={"#"}
                          className="flex items-center p-3 -m-3 rounded-md hover:bg-gray-50"
                          onClick={() => {
                            router.push("/#Plans")
                            setIsOpen(false)
                          }}
                        >
                          {/* Heroicon name: shield-check */}
                          <svg
                            className="flex-shrink-0 w-6 h-6 text-sky-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                          <span className="ml-3 text-base font-medium text-gray-900">
                            {t("header.plans")}
                          </span>
                        </a>

                        <a
                          href="#"
                          className="flex items-center p-3 -m-3 rounded-md hover:bg-gray-50"
                          onClick={() => {setIsOpen(false); router.push('/guides')}}
                        >
                          {/* Heroicon name: shield-check */}
                          <svg
                            className="flex-shrink-0 w-6 h-6 text-sky-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                          <span className="ml-3 text-base font-medium text-gray-900">
                            {t("header.guides")}
                          </span>
                        </a>
                      </nav>
                    </div>
                  </div>
                  <div className="px-5 py-6 space-y-6">
                    {!user ? (
                      <div>
                        {/*<Link
                          onClick={handleClickSignUp}
                          href="#"
                          className="flex items-center justify-center w-full px-4 py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm bg-sky-500 hover:bg-sky-500"
                        >
                          {t("header.signup")}
                        </Link>*/}
                        <p className="mt-6 text-base font-medium text-center text-gray-500">
                          {/*{t("header.existing_customer")}*/}
                          <span className="ml-6">
                            <Link
                              href="/api/auth/login"
                              className="text-sky-600 hover:text-sky-500"
                            >
                              {t("header.signin")}
                            </Link>
                          </span>
                        </p>
                      </div>
                    ) : (
                      <p className="mt-6 text-base font-medium text-center text-gray-500">
                        {/* Logged in customer? */}
                        <span className="ml-6">
                          <a
                          href="#"
                            onClick={handleClickSignOut}
                            className="text-sky-600 hover:text-sky-500"
                          >
                            {t("header.signout")}
                          </a>
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </>
  );
};

export default TheHeader;
