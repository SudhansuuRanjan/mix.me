import React, { FunctionComponent } from 'react';
import { QueryObserverResult } from '@tanstack/react-query';

interface ErrorFallbackProps {
    refetch: () => Promise<QueryObserverResult<any, unknown>> | void;
}

const ErrorFallback: FunctionComponent<ErrorFallbackProps> = ({ refetch }): React.ReactElement => {
    return (
        <div className='flex flex-col justify-center min-h-[24rem] w-full items-center text-center px-5'>
            <img src="./images/error.webp" className="w-52" alt="search" />
            <h1 className='text-white text-lg font-medium'>Something went wrong.</h1>
            <p className='text-gray-400 text-sm'>Please try again later.</p>
            <div className='text-white text-sm font-medium mt-5'>
                <button
                    onClick={refetch}
                    className='text-black font-medium uppercase py-2.5 px-6 rounded-full hover:bg-green-600 bg-green-500'
                >
                    Reload
                </button>
            </div>
        </div>
    );
};

export default ErrorFallback;
