import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa'; // Import sun and moon icons for light/dark mode toggle

// Header Component
// This component displays the header of the task list, including the title, dark mode toggle, and logout button.
const Header = ({ darkMode, setDarkMode, user, onLogout }) => {
  return (
    // Header container: Flexbox for horizontal layout, with spacing and alignment
    <div className="flex justify-between items-center mb-6">
      {/* Application Title */}
      <h3 className="text-3xl font-semibold">Task List</h3>

      {/* Buttons: Dark mode toggle and Log Out */}
      <div className="flex space-x-3">
        {/* Dark Mode Toggle Button */}
        <button
          className="p-2 bg-gray-700 text-white rounded hover:bg-gray-600" // Button styling
          onClick={() => setDarkMode(!darkMode)} // Toggle dark mode state when clicked
        >
          {darkMode ? (
            <FaSun className="text-yellow-400" /> // Show sun icon when in dark mode
          ) : (
            <FaMoon className="text-blue-400" /> // Show moon icon when in light mode
          )}
        </button>

        {/* Logout Button: Only displayed if a user is logged in */}
        {user && (
          <button
            onClick={onLogout} // Call the logout function when clicked
            className="p-2 bg-red-500 text-white rounded hover:bg-red-400" // Button styling
          >
            Log Out
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
