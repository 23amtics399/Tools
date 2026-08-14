import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { TOOLS as allTools } from '../config/tools';
import AllToolsGrid from '../components/home/AllToolsGrid';

export default function NotFound() {
  const popularTools = allTools.filter(t => t.popular).slice(0, 4);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <Helmet>
        <title>Page Not Found - Tools by sji.one</title>
      </Helmet>

      <h1 className="mb-4 text-6xl font-bold text-gray-900 dark:text-white">404</h1>
      <h2 className="mb-6 text-2xl font-semibold">Page Not Found</h2>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        Sorry, we couldn't find the page you're looking for.
      </p>
      
      <Link 
        to="/" 
        className="mb-16 rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 transition-colors"
      >
        Back to Home
      </Link>

      <div className="w-full max-w-4xl">
        <h3 className="mb-6 text-xl font-bold">Try our popular tools instead:</h3>
        <AllToolsGrid tools={popularTools} />
      </div>
    </div>
  );
}
