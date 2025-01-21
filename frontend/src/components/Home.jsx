import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState({});

  const getEmailFromToken = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

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
        `${import.meta.env.VITE_BASE_URI}/user/get/${userEmail}`
      );
      if (response.data.success) {
        setTodos(response.data.user.todo_list);
      }
    }
  };

  useEffect(() => {
    refreshTodos();
  }, []);

return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 py-10">
        <div className="max-w-5xl mx-auto px-6">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-extrabold text-indigo-900">
                    Todo Dashboard
                </h1>
                <Link
                    to="/newtodo"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
                >
                    Create Todo +
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {todos.map((todo) => (
                    <div
                        key={todo._id}
                        className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                            todo.priority === "high"
                                ? "border-l-4 border-red-500"
                                : "border-l-4 border-gray-300"
                        }`}
                    >
                        <div className="bg-white p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-gray-900">
                                    {todo.title}
                                </h3>
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        todo.priority === "high"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-blue-100 text-blue-800"
                                    }`}
                                >
                                    {todo.priority}
                                </span>
                            </div>

                            <p className="text-gray-600 mb-4 line-clamp-2">
                                {todo.description}
                            </p>

                            <div className="flex flex-col space-y-3">
                                <div className="flex items-center text-sm text-gray-500">
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

                                <div className="flex justify-between items-center">
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
                                            const action = todo.status === "completed" ? 'pending' : 'complete';
                                            const res = await axios({
                                                method: 'POST',
                                                url: `${import.meta.env.VITE_BASE_URI}/api/${action}/${todo._id}`,
                                            });
                                            if (res.data.success) {
                                                await refreshTodos();
                                            }
                                        }}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-300 ${
                                            todo.status === "completed"
                                                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                                                : "bg-green-500 hover:bg-green-600 text-white"
                                        }`}
                                    >
                                        {todo.status === "completed" ? "Mark Pending" : "Mark Complete"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {todos.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-xl">No todos yet</div>
                    <p className="text-gray-500 mt-2">
                        Create your first todo to get started!
                    </p>
                </div>
            )}
        </div>
    </div>
);
};

export default Home;
