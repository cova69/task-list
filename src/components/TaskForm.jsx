import React from 'react';

// TaskForm Component
// This component renders a form for adding a new task. It includes input fields for task text, deadline, and category.
const TaskForm = ({ input, setInput, deadline, setDeadline, category, setCategory, createTask, formError }) => {
  return (
    // Form container with vertical spacing between elements
    <form onSubmit={createTask} className="space-y-4">
      {/* Display an error message if formError is set */}
      {formError && <p className="text-red-500 text-sm">{formError}</p>}

      {/* Task Input Field */}
      <input
        value={input} // Bind the input value to the "input" state
        onChange={(e) => setInput(e.target.value)} // Update the state when the input changes
        className="w-full p-3 rounded-md border bg-white text-black" // Styling: full width, padding, rounded corners, and border
        type="text" // Input type is text
        placeholder="Add Task" // Placeholder text when the field is empty
      />

      {/* Deadline Input Field */}
      <input
        value={deadline} // Bind the value to the "deadline" state
        onChange={(e) => setDeadline(e.target.value)} // Update the state when the input changes
        className="w-full p-3 rounded-md border bg-white text-black" // Styling: same as the task input
        type="date" // Input type is date for selecting deadlines
      />

      {/* Category Dropdown */}
      <select
        value={category} // Bind the selected value to the "category" state
        onChange={(e) => setCategory(e.target.value)} // Update the state when the selection changes
        className="w-full p-3 rounded-md border bg-white text-black" // Styling: dropdown matches the input fields
      >
        {/* Default option prompting the user to select a category */}
        <option value="">Select Category</option>
        {/* Specific category options */}
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
        <option value="Shopping">Shopping</option>
      </select>

      {/* Submit Button */}
      <button className="w-full p-3 bg-purple-500 text-white rounded-md">
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
