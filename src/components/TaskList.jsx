import React from 'react';
import { FaTrash, FaCheck } from 'react-icons/fa'; // Import icons for trash (delete) and check (mark complete)

// TaskList Component
// This component renders a list of tasks with their details, such as text, deadline, category, and action buttons.
const TaskList = ({ tasks, toggleComplete, deleteTask, darkMode, getCategoryColor }) => {
  // Function to export tasks to CSV
  const exportToCSV = () => {
    if (tasks.length === 0) {
      alert('No tasks to export!');
      return;
    }

    // Define the headers for the CSV
    const headers = ['Task Text', 'Category', 'Deadline', 'Completed'];

    // Map the tasks into rows
    const rows = tasks.map((task) => [
      task.text,
      task.category,
      new Date(task.deadline.seconds * 1000).toLocaleDateString(),
      task.completed ? 'Yes' : 'No',
    ]);

    // Generate CSV content
    const csvContent = [
      headers.join(','), // Join the headers with commas
      ...rows.map((row) => row.join(',')), // Join each row with commas
    ].join('\n');

    // Create a Blob for the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Trigger a download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'tasks.csv'); // Set the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* The container for the list of tasks */}
      <ul className="space-y-4 mt-4">
        {tasks.map((task) => (
          // Each task is rendered inside a <li> element with a unique key
          <li
            key={task.id} // Ensure React can efficiently update/render list items by providing a unique key
            className={`p-4 rounded-md shadow-md transition ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
            }`} // Conditional styling for dark mode and light mode
          >
            {/* Container for task details and action buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              {/* Task Text and Deadline */}
              <div className="flex-1 min-w-0">
                {/* Display the task's text */}
                <p className="text-sm font-medium break-words">
                  {task.text}
                </p>
                {/* Display the task's deadline formatted as a readable date */}
                <p className="text-xs text-gray-500">
                  Deadline: {new Date(task.deadline.seconds * 1000).toLocaleDateString()}
                </p>
              </div>

              {/* Category and Action Buttons */}
              <div className="flex flex-row sm:flex-row items-center justify-start space-x-4">
                {/* Category Label */}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold flex-shrink-0 ${getCategoryColor(
                    task.category
                  )}`} // Apply a color based on the category using getCategoryColor
                >
                  {task.category}
                </span>

                {/* Mark Complete Button */}
                <button
                  onClick={() => toggleComplete(task)} // Call toggleComplete when clicked
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition ${
                    task.completed
                      ? 'bg-green-500 text-white hover:bg-green-600' // Style for completed tasks
                      : 'bg-gray-300 text-black hover:bg-gray-400' // Style for incomplete tasks
                  }`}
                >
                  <FaCheck size={16} /> {/* Check icon for marking tasks complete */}
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => deleteTask(task.id)} // Call deleteTask when clicked
                  className="w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 transition flex items-center justify-center"
                >
                  <FaTrash size={16} /> {/* Trash icon for deleting tasks */}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Export to CSV Button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={exportToCSV} // Calls the export function when clicked
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        >
          Export to CSV
        </button>
      </div>
    </div>
  );
};

// Export the TaskList component to be used in other parts of the app
export default TaskList;
