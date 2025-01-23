import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { spiral } from "ldrs";

spiral.register();



const Home = () => {
  const [todos, setTodos] = useState(null);
  const [user, setUser] = useState(null);

  const getEmailFromToken = () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.email;
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const getUser = async () => {
      const userEmail = getEmailFromToken();
      if (!userEmail) return;

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URI}/user/get/${userEmail}`
      );

      if (response.data.success) {
        setUser(response.data.user);
        setTodos(response.data.user.todo_list);
      }
    };

    getUser();
  }, []);

  const refreshTodos = async () => {
    const userEmail = getEmailFromToken();
    if (userEmail) {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URI}/user/get/${userEmail}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setTodos(response.data.user.todo_list);
      }
    }
  };

  useEffect(() => {
    refreshTodos();
  }, []);

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <l-spiral size="40" speed="0.9" color="black"></l-spiral>
      </div>
    );
  }

return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
        <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
            <div className="flex items-center justify-between p-4">
                <h1 className="text-xl font-bold">Todo App</h1>
                <div className="flex items-center space-x-4">
                    <Link 
                        to="/newtodo"
                        className="text-blue-500 hover:text-blue-700"
                    >
                        New Todo
                    </Link>
                    <Link 
                        to="/profile" 
                        className="text-blue-500 hover:text-blue-700"
                    >
                        Profile
                    </Link>
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                        }}
                        className="text-red-500 hover:text-red-700"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
            <div className="flex justify-end mb-6">
                <Link 
                    to="/newtodo"
                    className="bg-blue-500 text-white px-4 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
                >
                    Create Todo +
                </Link>
            </div>

            {/* Todo Grid with Sorting */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {[...todos]
                    .sort((a, b) => {
                        // First, sort by completion status
                        if (a.status !== b.status) {
                            return a.status === "completed" ? 1 : -1;
                        }
                        // Then, for incomplete items, sort by priority
                        if (a.status !== "completed") {
                            return a.priority === "high" ? -1 : 1;
                        }
                        return 0;
                    })
                    .map((todo) => (
                        <div
                            key={todo._id}
                            className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                                todo.priority === "high"
                                    ? "border-l-4 border-red-500"
                                    : "border-l-4 border-gray-300"
                            }`}
                        >
                            {/* ... (keep existing todo card content) ... */}
                            <div className="bg-white p-4 sm:p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-1">
                                        {todo.title}
                                    </h3>
                                    <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                            todo.priority === "high"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-blue-100 text-blue-800"
                                        }`}
                                    >
                                        {todo.priority}
                                    </span>
                                </div>

                                <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-2">
                                    {todo.description}
                                </p>

                                <div className="flex flex-col space-y-3">
                                    <div className="flex items-center text-xs sm:text-sm text-gray-500">
                                        <svg
                                            className="w-4 h-4 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        Due: {new Date(todo.dueDate).toLocaleDateString()}
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                todo.status === "completed"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                            }`}
                                        >
                                            {todo.status}
                                        </span>

                                        <button
                                            onClick={async () => {
                                                const action =
                                                    todo.status === "completed" ? "pending" : "complete";
                                                const res = await axios({
                                                    method: "POST",
                                                    url: `${
                                                        import.meta.env.VITE_BASE_URI
                                                    }/api/${action}/${todo._id}`,
                                                });
                                                if (res.data.success) {
                                                    await refreshTodos();
                                                }
                                            }}
                                            className={`w-full sm:w-auto px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition duration-300 ${
                                                todo.status === "completed"
                                                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                                                    : "bg-green-500 hover:bg-green-600 text-white"
                                            }`}
                                        >
                                            {todo.status === "completed"
                                                ? "Mark Pending"
                                                : "Mark Complete"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>

            {todos.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-lg sm:text-xl">No todos yet</div>
                    <p className="text-gray-500 mt-2 text-sm sm:text-base">
                        Create your first todo to get started!
                    </p>
                </div>
            )}
        </div>
    </div>
);
};

export default Home;
