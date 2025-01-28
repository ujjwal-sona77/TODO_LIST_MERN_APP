import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { spiral } from "ldrs";

spiral.register();

const NewTodo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [dueTime, setDueTime] = useState("");
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
      }
    };

    getUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URI}/api/create/todo/${getEmailFromToken()}`,
      {
        title,
        description,
        priority,
        dueDate,
        dueTime,
      },
      { withCredentials: true }
    );

    if (res.data.success) {
      setMessage(res.data.message);
      setTimeout(() => {
        navigate("/home");
        setMessage("");
      }, 2000);
    } else {
      setMessage(res.data.message);
    }

    setTitle("");
    setDescription("");
    setPriority("");
    setDueDate("");
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <l-spiral size="40" speed="0.9" color="black"></l-spiral>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gray-50">
        <div className="center flex flex-col justify-center items-center min-h-screen p-4">
          {/* Navigation section remains the same */}
          <nav className="fixed top-0 w-full bg-gray-800 text-white p-4 flex flex-wrap justify-between items-center z-10">
            <div className="text-base sm:text-xl font-bold truncate max-w-[150px] md:max-w-none">
              Welcome, {user.username || "User"}
            </div>
            <div className="flex gap-2 sm:gap-4">
              <button
                onClick={() => navigate("/home")}
                className="px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base hover:bg-blue-600 rounded-lg transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
                }}
                className="px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base hover:bg-red-600 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </nav>

          {/* Form Container */}
          <div className="w-full max-w-4xl px-4 mt-24 mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center">
              Create a New <span className="text-blue-500">TODO</span>
            </h1>

            <form
              onSubmit={handleSubmit}
              method="post"
              className="new-todo-form p-6 md:p-8 bg-white w-full max-w-[35rem] mx-auto flex flex-col gap-5 rounded-xl shadow-lg"
            >
              {message && (
                <div
                  className={`p-4 rounded-lg text-sm sm:text-base ${
                    message.includes("Successfully")
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700" htmlFor="title">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    name="title"
                    onChange={(e) => setTitle(e.target.value)}
                    className="rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter the title for your Todo"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    className="font-medium text-gray-700"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    name="description"
                    id="description"
                    rows="3"
                    className="rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter the description"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label
                      className="font-medium text-gray-700"
                      htmlFor="priority"
                    >
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="mt-1 w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="" disabled>
                        Select priority
                      </option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <label
                        className="font-medium text-gray-700"
                        htmlFor="dueDate"
                      >
                        Due Date
                      </label>
                      <input
                        name="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        type="date"
                        id="dueDate"
                        className="mt-1 w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label
                        className="font-medium text-gray-700"
                        htmlFor="dueTime"
                      >
                        Due Time
                      </label>
                      <input
                        name="dueTime"
                        type="time"
                        id="dueTime"
                        value={dueTime}
                        onChange={(e) => setDueTime(e.target.value)}
                        className="mt-1 w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 w-full bg-blue-500 text-white px-6 py-3 rounded-lg text-base font-semibold hover:bg-blue-600 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:ring-4 focus:ring-blue-200"
              >
                Create Todo
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default NewTodo;
