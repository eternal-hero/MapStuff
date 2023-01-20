import React from 'react';

const PaymentSuccess =({children}) =>{
    return(
        <>
        <div>
            <div className="mt-8">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-lg leading-6 font-medium text-gray-900">
                  Your payment was successful.  
                </h1>
              </div>
            </div>
        </div>
        </>
    )
}

export default PaymentSuccess;
