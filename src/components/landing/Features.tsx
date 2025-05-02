'use client';

import { FC } from 'react';

const Features: FC = () => {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-4xl font-bold">
          For 🏝️ individuals, 🎨 independent creators and 💼 tech companies
        </h2>
        <p className="text-xl text-gray-600">
          Empowering individuals, creators, and tech innovators with cutting-edge AI solutions.
        </p>
      </div>

      <div className="mb-16">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-purple-100 px-4 py-2">
            <span className="flex items-center gap-2 text-lg font-semibold text-purple-600">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Generate
            </span>
          </div>
          <h3 className="text-2xl">Images never used.</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="overflow-hidden rounded-lg bg-white p-2 shadow-lg">
          <div className="h-64 w-full overflow-hidden rounded-lg bg-gray-200">
            <img
              src="/images/feature-1.jpg"
              alt="Feature 1"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="overflow-hidden rounded-lg bg-white p-2 shadow-lg">
          <div className="h-64 w-full overflow-hidden rounded-lg bg-gray-200">
            <img
              src="/images/feature-2.jpg"
              alt="Feature 2"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="overflow-hidden rounded-lg bg-white p-2 shadow-lg">
          <div className="h-64 w-full overflow-hidden rounded-lg bg-gray-200">
            <img
              src="/images/feature-3.jpg"
              alt="Feature 3"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
