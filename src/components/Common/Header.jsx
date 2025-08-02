import React from "react";
import { useAuth } from "@hooks/useAuth";

const Header = ({ onCreateNote }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40 h-auto sm:h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 sm:py-0 gap-3 sm:gap-0 mx-3 sm:mx-0 sm:h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center shrink-0">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-900 sm:text-lg">
                Code Notebook
              </h1>
              <p className="text-xs text-gray-500 truncate max-w-[200px]">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full sm:w-auto flex justify-between sm:justify-end items-center gap-2 sm:gap-3">
            <button
              onClick={onCreateNote}
              className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-primary-600 bg-white border border-primary-600 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow"
            >
              <svg
                className="h-4 w-4 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              New Note
            </button>

            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title="Sign out"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
