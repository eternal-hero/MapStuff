import React from 'react';

const HowToAddMapToWordpress =({children}) =>{
    return(
        <>
        <div>
            <div id="HowToAddMapToWordpress" className="relative py-8 bg-white sm:py-12 lg:py-16">
            <div className="text-center">
                {/*<h2 className="text-lg font-semibold leading-6 tracking-wider text-gray-300 uppercase">
                  Pricing
                </h2>*/}
                <h1 className="block text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                  How to Add a Map to Wordpress
                </h1>
                {/*<p className="max-w-4xl mx-auto mt-3 text-xl text-gray-300 sm:mt-5 sm:text-2xl">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit
                  numquam eligendi quos odit doloribus molestiae voluptatum.
                </p>*/}
              </div>

              <div className="max-w-md px-4 mx-auto sm:max-w-4xl md:max-w-5xl sm:px-6 lg:px-8 lg:max-w-7xl">

                <div className="relative py-16 overflow-hidden bg-white">
                  <div className="relative px-4 sm:px-6 lg:px-8">
                    {/*<div className="mx-auto text-lg max-w-prose">
                      <h1>
                        <span className="block text-base font-semibold tracking-wide text-center text-indigo-600 uppercase">Introducing</span>
                        <span className="block mt-2 text-3xl font-extrabold leading-8 tracking-tight text-center text-gray-900 sm:text-4xl">How to Add Map to Wordpress</span>
                      </h1>
                    </div>*/}
                    <div className="mx-auto mt-6 prose text-gray-500 prose-indigo prose-md">
                      <ol className="list-inside">
                        <li>Copy your Mapstuff embed code.
                          <ol className="ml-5 list-inside">
                            <li>Login in to your MapStuff account.</li>
                            <li>After creating your map, go to the Map Embed Code page.</li>
                            <li>Copy the embed code.</li>
                          </ol>
                        </li>
                        <li>Log in to your Wordpress account.</li>
                        <li>In your dashboard, create a new page. Use a blank layout.</li>
                        <li>Add a block.</li>
                        <li>Choose code and paste the embed code.</li>
                        <li>Save page.</li>
                      </ol>                       
                    </div>
                  </div>
                </div>

              </div>
            </div>

        </div>
        </>
    )
}

export default HowToAddMapToWordpress;
