import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-8 bg-theatre-dark text-white">
      <h1 className="text-8xl sm:text-9xl font-extrabold text-theatre-gold tracking-tight mb-2">
        404
      </h1>

      <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
        Page Not Found
      </h2>

      <p className="text-gray-400 max-w-md mb-8 text-base sm:text-lg">
        The page you are looking for doesn't exist or has been moved.
      </p>

      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-theatre-gold text-theatre-grey-deep font-semibold hover:bg-theatre-gold-light transition-all duration-200 shadow-md"
      >
        <Home className="w-5 h-5" />
        Return to Home
      </Link>
    </div>
  );
}
