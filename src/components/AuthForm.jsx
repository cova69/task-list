import React from 'react';

// AuthForm Component
// This component provides a simple authentication form with fields for email and password, along with Log In and Sign Up buttons.
const AuthForm = ({
  email, // The email input value
  setEmail, // Function to update the email input state
  password, // The password input value
  setPassword, // Function to update the password input state
  handleLogin, // Function to handle the login process
  handleSignUp, // Function to handle the sign-up process
  authError, // Error message to display if authentication fails
}) => {
  return (
    // Container for the authentication form
    <div className="space-y-4">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-center">Authentication</h2>

      {/* Error Message */}
      {authError && (
        <p className="text-red-500 text-sm text-center">
          {authError}
        </p>
      )}

      {/* Email Input Field */}
      <input
        type="email" // Input type: email
        value={email} // Bind the value to the email state
        onChange={(e) => setEmail(e.target.value)} // Update the email state on input change
        placeholder="Email" // Placeholder text
        className="w-full p-3 rounded-md border bg-white text-black" // Tailwind classes for styling
      />

      {/* Password Input Field */}
      <input
        type="password" // Input type: password
        value={password} // Bind the value to the password state
        onChange={(e) => setPassword(e.target.value)} // Update the password state on input change
        placeholder="Password" // Placeholder text
        className="w-full p-3 rounded-md border bg-white text-black" // Tailwind classes for styling
      />

      {/* Buttons for Login and Sign Up */}
      <div className="flex flex-col space-y-2">
        {/* Log In Button */}
        <button
          onClick={handleLogin} // Call the handleLogin function on click
          className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600" // Tailwind classes for styling and hover effect
        >
          Log In
        </button>

        {/* Sign Up Button */}
        <button
          onClick={handleSignUp} // Call the handleSignUp function on click
          className="w-full p-3 bg-green-500 text-white rounded-md hover:bg-green-600" // Tailwind classes for styling and hover effect
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
