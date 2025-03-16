import React from 'react';

// Pagination Component
// This component displays pagination buttons for navigating through pages.
const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
  // If there is only 1 page, don't render the pagination component
  if (totalPages <= 1) return null;

  return (
    // Container for pagination buttons
    <div className="flex justify-center mt-4 space-x-2">
      {/* Generate an array of length 'totalPages' and map over it to create buttons */}
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i} // Assign a unique key for each button
          className={`p-2 px-4 rounded transition ${
            i + 1 === currentPage // Highlight the current page button
              ? 'bg-purple-600 text-white shadow-md' // Active page styles
              : 'bg-gray-400 text-black hover:bg-gray-500' // Inactive page styles with hover effect
          }`}
          onClick={() => setCurrentPage(i + 1)} // Set the page number on button click
          aria-label={`Go to page ${i + 1}`} // Accessibility: Describe the button's purpose
        >
          {i + 1} {/* Display the page number */}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
