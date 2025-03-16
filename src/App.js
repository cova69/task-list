import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase'; // Firebase database and authentication imports
import {
  query,
  collection,
  where,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore'; // Firestore functions
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth'; // Firebase authentication functions
import Header from './components/Header';
import AuthForm from './components/AuthForm';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Pagination from './components/Pagination';

// Main App Component
const App = () => {
  // State management for various app functionalities
  const [tasks, setTasks] = useState([]); // Stores tasks
  const [input, setInput] = useState(''); // Task input field value
  const [deadline, setDeadline] = useState(''); // Task deadline value
  const [category, setCategory] = useState(''); // Task category
  const [darkMode, setDarkMode] = useState(false); // Toggle for dark mode
  const [sortBy, setSortBy] = useState('creationDate'); // Sorting criteria
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [user, setUser] = useState(null); // Logged-in user
  const [email, setEmail] = useState(''); // Email input for auth
  const [password, setPassword] = useState(''); // Password input for auth
  const [formError, setFormError] = useState(''); // Error messages for task form
  const [authError, setAuthError] = useState(''); // Error messages for auth form
  const tasksPerPage = 5; // Number of tasks displayed per page

  // Effect to track user authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update the user state when auth state changes
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  // Effect to fetch tasks for the logged-in user
  useEffect(() => {
    if (!user) {
      setTasks([]); // Clear tasks if no user is logged in
      return;
    }

    const q = query(collection(db, 'task-db'), where('userId', '==', user.uid)); // Query tasks for the user
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let tasksArr = [];
      querySnapshot.forEach((doc) => {
        tasksArr.push({ ...doc.data(), id: doc.id }); // Populate tasks array
      });

      setTasks(tasksArr); // Update tasks state
    });

    return () => unsubscribe(); // Cleanup Firestore listener
  }, [user]);
  const exportToCSV = () => {
    if (tasks.length === 0) {
      alert('No tasks to export!');
      return;
    }
  
    const headers = ['Task Text', 'Category', 'Deadline', 'Completed'];
    const rows = tasks.map(task => [
      task.text,
      task.category,
      new Date(task.deadline.seconds * 1000).toLocaleDateString(),
      task.completed ? 'Yes' : 'No',
    ]);
  
    const csvContent = [
      headers.join(','), // Add the headers as the first row
      ...rows.map(row => row.join(',')), // Add task rows
    ].join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'tasks.csv'); // Set the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // Function to create a new task
  const createTask = async (e) => {
    e.preventDefault();

    // Validation for task input
    if (input === '' || input.length > 100) {
      setFormError('Task must be between 1 and 100 characters');
      return;
    }

    // Validation for deadline
    if (!deadline) {
      setFormError('Please set a deadline');
      return;
    }

    const now = new Date();
    const selectedDeadline = new Date(deadline);
    if (selectedDeadline < now) {
      setFormError('Deadline cannot be in the past');
      return;
    }

    // Validation for category
    if (!category) {
      setFormError('Please select a category');
      return;
    }

    setFormError(''); // Clear form errors

    try {
      const deadlineTimestamp = Timestamp.fromDate(selectedDeadline);
      await addDoc(collection(db, 'task-db'), {
        text: input,
        completed: false,
        creationDate: Timestamp.fromDate(new Date()),
        deadline: deadlineTimestamp,
        category,
        userId: user.uid,
      });

      // Clear inputs after successful submission
      setInput('');
      setDeadline('');
      setCategory('');
    } catch (error) {
      setFormError('An error occurred while creating the task. Please try again.');
    }
  };

  // Function to toggle task completion status
  const toggleComplete = async (task) => {
    await updateDoc(doc(db, 'task-db', task.id), {
      completed: !task.completed,
    });
  };

  // Function to delete a task
  const deleteTask = async (id) => {
    await deleteDoc(doc(db, 'task-db', id));
  };

  // Function to handle user sign-up
  const handleSignUp = async () => {
    if (!email || !password) {
      setAuthError('Email and Password are required');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
      setAuthError('');
      alert('Account created successfully!');
    } catch (error) {
      setAuthError(error.message);
    }
  };

  // Function to handle user login
  const handleLogin = async () => {
    if (!email || !password) {
      setAuthError('Email and Password are required');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
      setAuthError('');
      alert('Logged in successfully!');
    } catch (error) {
      setAuthError(error.message);
    }
  };

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      alert('Logged out successfully!');
    } catch (error) {
      alert(error.message);
    }
  };

  // Function to get color for a task category
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Work':
        return 'bg-blue-500 text-white';
      case 'Personal':
        return 'bg-pink-500 text-white';
      case 'Shopping':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Function to sort tasks
  const getSortedTasks = () => {
    return [...tasks].sort((a, b) => {
      if (sortBy === 'creationDate') {
        return a.creationDate.seconds - b.creationDate.seconds;
      }
      if (sortBy === 'deadline') {
        return a.deadline.seconds - b.deadline.seconds;
      }
      return 0;
    });
  };

  // Pagination logic
  const sortedTasks = getSortedTasks();
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = sortedTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(sortedTasks.length / tasksPerPage);

  return (
    <div
      className={`${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-blue-500 to-purple-500 text-black'
      } min-h-screen p-6`}
    >
      <div
        className={`${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
        } max-w-lg mx-auto p-6 rounded-lg shadow-lg`}
      >
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          user={user}
          onLogout={handleLogout}
        />
        {!user ? (
          <AuthForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin}
            handleSignUp={handleSignUp}
            authError={authError}
          />
        ) : (
          <>
            <TaskForm
              input={input}
              setInput={setInput}
              deadline={deadline}
              setDeadline={setDeadline}
              category={category}
              setCategory={setCategory}
              createTask={createTask}
              formError={formError}
            />
            <div className="grid grid-cols-2 gap-4 my-4">
              <button
                className={`w-full py-2 px-4 rounded ${
                  sortBy === 'creationDate' ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
                }`}
                onClick={() => setSortBy('creationDate')}
              >
                Sort by Creation Date
              </button>
              <button
                className={`w-full py-2 px-4 rounded ${
                  sortBy === 'deadline' ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
                }`}
                onClick={() => setSortBy('deadline')}
              >
                Sort by Deadline
              </button>
            </div>
            <TaskList
              tasks={currentTasks}
              toggleComplete={toggleComplete}
              deleteTask={deleteTask}
              darkMode={darkMode}
              getCategoryColor={getCategoryColor}
            />
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
