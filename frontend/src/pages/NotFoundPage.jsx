import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <section className="bg-white dark:bg-gray-900 min-h-screen flex flex-col justify-center items-center">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-white">
            404
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
            Something&apos;s missing.
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            Sorry, we can&apos;t find that page. You&apos;ll find lots to
            explore on the home page.&nbsp;
          </p>
          <Link
            to="/"
            className="inline-block px-4 py-2 text-2xl font-semibold text-white underline underline-offset-4 decoration-2 hover:no-underline transition focus:outline-none focus:ring-2 focus:ring-primary-300 dark:text-primary-400 my-4"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
