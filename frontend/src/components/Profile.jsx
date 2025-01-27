import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { spiral } from "ldrs";

spiral.register();

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
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
  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <l-spiral size="40" speed="0.9" color="black"></l-spiral>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <nav className="bg-white shadow-lg mb-8 rounded-lg max-w-3xl mx-auto">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex space-x-4">
            <a
              href="/home"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Home
            </a>
            <a
              href="/newtodo"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              New Todo
            </a>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 pt-8 pb-6 bg-gradient-to-r from-blue-600 to-indigo-600">
            <h2 className="text-4xl font-bold text-white text-center">
              Welcome, {user.username}
            </h2>
          </div>

          <div className="px-8 py-10">
            <div className="space-y-8">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {user.username}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-blue-500"
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
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Member Since
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Your Tasks
                </h3>
                <div className="space-y-2">
                  {user.todo_list?.map((todo) => (
                    <div
                      key={todo._id}
                      className="p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow flex justify-between items-center"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {todo.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {todo.description}
                        </p>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className="text-xs text-gray-500">
                            Due: {new Date(todo.dueDate).toLocaleDateString()}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              todo.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : todo.status === "in-progress"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {todo.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={async ()=> {
                            const res = await axios.get(
                              `${import.meta.env.VITE_BASE_URI}/api/${todo.status === "complete" ? "pending" : "complete"}/todo/${todo._id}`
                            );
                            if (res.data.success) {
                                const updatedTodos = user.todo_list.map((t) => {
                                    if (t._id === todo._id) {
                                        return {
                                            ...t,
                                            status: todo.status === "completed" ? "pending" : "completed"
                                        };
                                    }
                                    return t;
                                });
                                setUser({ ...user, todo_list: updatedTodos });
                            }
                        }} className="text-blue-500 hover:text-blue-700">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={async () => {
                            const res = await axios.get(
                              `${
                                import.meta.env.VITE_BASE_URI
                              }/api/delete/todo/${todo._id}`
                            );
                            if (res.data.success) {
                              const updatedTodos = user.todo_list.filter(
                                (t) => t._id !== todo._id
                              );
                              setUser({ ...user, todo_list: updatedTodos });
                            }
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
