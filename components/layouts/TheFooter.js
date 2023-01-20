import React from 'react';
import { useTranslation } from "react-i18next";
import { LanguageDropdown } from "../global/LanguageDropdown";

const TheFooter = ({ children }) => {
  const { t } = useTranslation();
  return (
    <>
      <div>
        <footer className="bg-gray-500">
         
      
  
          <footer className="bg-gray-800" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">Footer</h2>
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
              {/* <div className="pb-8 xl:grid xl:grid-cols-5 xl:gap-8">
                <div className="grid grid-cols-2 gap-8 xl:col-span-4">
                  <div className="md:grid md:grid-cols-2 md:gap-8">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Solutions</h3>
                      <ul role="list" className="mt-4 space-y-4">
                        <li>
                          <a href="#" className="text-base text-gray-300 hover:text-white"> Features </a>
                        </li>
                        <li>
                          <a href="#" className="text-base text-gray-300 hover:text-white"> Integrations </a>
                        </li>
                        <li>
                          <a href="#" className="text-base text-gray-300 hover:text-white"> Demo </a>
                        </li>

                      
                      </ul>
                    </div>
                    <div className="mt-12 md:mt-0">
                      <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
                      <ul role="list" className="mt-4 space-y-4">
                        <li>
                          <a href="#" className="text-base text-gray-300 hover:text-white"> Pricing </a>
                        </li>
                        <li>
                          <a href="#" className="text-base text-gray-300 hover:text-white"> Guides </a>
                        </li>

                      </ul>
                    </div>
                  </div>
                  <div className="md:grid md:grid-cols-2 md:gap-8">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
                      <ul role="list" className="mt-4 space-y-4">
                        <li>
                          <a href="#" className="text-base text-gray-300 hover:text-white"> About </a>
                        </li>

                      </ul>
                    </div>
                    <div className="mt-12 md:mt-0">
                      <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
                      <ul role="list" className="mt-4 space-y-4">
                        <li>
                          <a href="#" className="text-base text-gray-300 hover:text-white"> Claim </a>
                        </li>

                      </ul>
                    </div> 
                  </div> 
                </div>
                
                <LanguageDropdown /> 
              </div> */} 

              <div className="md:flex md:items-center md:justify-between xl:grid xl:grid-cols-2 xl:gap-8">
                <div>
                  <ul role="list" className="flex space-x-6">
                    <li>
                      <a href="/features" className="text-base text-gray-300 hover:text-white"> Features </a>
                    </li>
                    <li>
                      <a href="/#Integrations" className="text-base text-gray-300 hover:text-white"> Integrations </a>
                    </li>
                    <li>
                      <a href="/en/demo" className="text-base text-gray-300 hover:text-white"> Demo </a>
                    </li>
                    <li>
                      <a href="/#Plans" className="text-base text-gray-300 hover:text-white"> Plans </a>
                    </li>
                    <li>
                      <a href="/guides" className="text-base text-gray-300 hover:text-white"> Guides </a>
                    </li>
                  </ul>
                </div>
                {/*<div className="md:place-self-end">
                  <LanguageDropdown /> 
                </div>*/}
              </div>

              <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
                <div className="flex space-x-6 md:order-2">
                  {/*<a href="#" className="text-gray-400 hover:text-gray-300">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
                    </svg>
                  </a>*/}

                  {/*<a href="#" className="text-gray-400 hover:text-gray-300">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>*/}

                  <a href="mailto:info@MapStuff.io" className="text-gray-400 hover:text-gray-300">
                    <span className="sr-only">Email</span>
                    <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </a>

                  <a href="https://t.me/mapstuff" className="text-gray-400 hover:text-gray-300">
                    <span className="sr-only">Telegram</span>
                    <svg className="h-6 w-6" viewBox="0 0 48 48" fill="currentColor" aria-hidden="true"><path d="M41.4193 7.30899C41.4193 7.30899 45.3046 5.79399 44.9808 9.47328C44.8729 10.9883 43.9016 16.2908 43.1461 22.0262L40.5559 39.0159C40.5559 39.0159 40.3401 41.5048 38.3974 41.9377C36.4547 42.3705 33.5408 40.4227 33.0011 39.9898C32.5694 39.6652 24.9068 34.7955 22.2086 32.4148C21.4531 31.7655 20.5897 30.4669 22.3165 28.9519L33.6487 18.1305C34.9438 16.8319 36.2389 13.8019 30.8426 17.4812L15.7331 27.7616C15.7331 27.7616 14.0063 28.8437 10.7686 27.8698L3.75342 25.7055C3.75342 25.7055 1.16321 24.0823 5.58815 22.459C16.3807 17.3729 29.6555 12.1786 41.4193 7.30899Z"></path>
                    </svg>
                  </a>

                </div>
                <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">&copy; {t("footer")}</p>
              </div>

              
            </div>
          </footer>
          
        </footer>
      </div>
    </>
  );
};

export default TheFooter;
