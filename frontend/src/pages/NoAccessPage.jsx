import React from 'react';

const NoAccessPage = () => {
  return (
    <section className="bg-white dark:bg-gray-900 min-h-screen flex flex-col justify-center items-center">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-5xl tracking-tight font-extrabold lg:text-7xl text-primary-600 dark:text-white">
            Access Denied
          </h1>
          <p className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white md:text-3xl">
            You do not have permission to access this page.
          </p>
          <p className="mb-6 text-base font-light text-gray-500 dark:text-gray-400">
            Please log in with an authorized account or contact support if you
            believe this is an error.
          </p>
          <a
            href="/login"
            className="inline-flex items-center justify-center text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
          >
            Return to Login
          </a>
        </div>
      </div>
    </section>
  );
};

export default NoAccessPage;
