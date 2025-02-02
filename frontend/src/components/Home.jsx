import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { spiral } from "ldrs";

spiral.register();

const Home = () => {
  const [todos, setTodos] = useState(null);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
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
        const updatedTodos = response.data.user.todo_list.map((todo) => {
          const currentDateTime = new Date();
          const dueDateTime = new Date(`${todo.dueDate}T${todo.dueTime}`);
          if (currentDateTime > dueDateTime && todo.status === "pending") {
            todo.status = "delayed";
          }
          return todo;
        });
        setTodos(updatedTodos);
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

  if (!token) {
    window.location.href = "/login";
  }

  async function session_check() {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }

    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URI}/api/check/session/${token}`,
      { withCredentials: true }
    );

    if (!response.data.success) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      alert("Session Expired");
    }
  }

  session_check();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
      <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-xl font-bold text-gray-900">
                  TODO LISTS
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Link
                to="/profile"
                className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                className="ml-4 bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
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
              if (a.status !== b.status) {
                return a.status === "completed" ? 1 : -1;
              }
              if (a.status !== "completed") {
                return a.priority === "high" ? -1 : 1;
              }
              return 0;
            })
            .map((todo) => {
              const currentDateTime = new Date();
              const currentTime = currentDateTime.toLocaleTimeString("en-US", {
                hour12: false,
              });
              const dueTime = todo.dueTime;

              const dueDateObj = new Date(todo.dueDate);
              const dueDateTime = new Date(`${todo.dueDate}T${todo.dueTime}`);
              const isDelayed = 
                currentDateTime > dueDateTime && todo.status !== "completed";
              const todoStatus = isDelayed ? "delayed" : todo.status;

              return (
                <div
                  key={todo._id}
                  className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                    todo.priority === "high"
                      ? "border-l-4 border-red-500"
                      : "border-l-4 border-gray-300"
                  }`}
                >
                  <div className="bg-white p-4 sm:p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3
                        className={`text-base sm:text-lg font-bold text-gray-900 line-clamp-1 ${
                          isDelayed ? "line-through" : ""
                        }`}
                      >
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

                    <p
                      className={`text-sm sm:text-base text-gray-600 mb-4 line-clamp-2 ${
                        isDelayed ? "line-through" : ""
                      }`}
                    >
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
                        Due: {new Date(todo.dueDate).toLocaleDateString()}{" "}
                        {todo.dueTime}
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                        {isDelayed ? (
                          <span className="text-red-600 font-bold text-base">
                            DELAYED
                          </span>
                        ) : (
                          <>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                todoStatus === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {todoStatus}
                            </span>

                            <button
                              onClick={async () => {
                                const action =
                                  todo.status === "completed"
                                    ? "pending"
                                    : "complete";
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
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
