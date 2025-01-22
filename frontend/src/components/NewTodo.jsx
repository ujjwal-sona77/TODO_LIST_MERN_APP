import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NewTodo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({});
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

return (
    <>
        <main>
            <div className="center flex flex-col justify-center items-center min-h-screen p-4">
                    <nav className="fixed top-0 w-full bg-gray-800 text-white p-4 flex flex-wrap justify-between items-center">
                            <div className="text-xl font-bold truncate max-w-[200px] sm:max-w-none">Welcome, {user.username || 'User'}</div>
                            <div className="flex gap-4">
                                    <button 
                                            onClick={() => navigate('/home')} 
                                            className="hover:text-blue-300"
                                    >
                                            Home
                                    </button>
                                    <button 
                                            onClick={() => {
                                                    localStorage.removeItem('token');
                                                    navigate('/login');
                                            }} 
                                            className="hover:text-red-300"
                                    >
                                            Logout
                                    </button>
                            </div>
                    </nav>
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 mt-20 text-center">
                    Create a New <span className="text-blue-500">TODO</span>
                </h1>
                <form
                    onSubmit={handleSubmit}
                    method="post"
                    className="new-todo-form p-4 sm:p-8 bg-[#dadada] w-full max-w-[30rem] flex flex-col gap-4 sm:gap-6 rounded-lg shadow-lg mx-4"
                >
                    {message && (
                        <div
                            className={`p-4 rounded-lg ${
                                message.includes("Successfully")
                                    ? "bg-green-200 text-green-800"
                                    : "bg-red-200 text-red-800"
                            }`}
                        >
                            {message}
                        </div>
                    )}
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-lg sm:text-xl" htmlFor="title">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            name="title"
                            onChange={(e) => setTitle(e.target.value)}
                            className="rounded-lg text-base sm:text-lg p-2 w-full"
                            placeholder="Enter the title for your Todo"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="description" className="font-semibold text-lg sm:text-xl">
                            Description
                        </label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            name="description"
                            id="description"
                            className="rounded-lg text-base sm:text-lg p-2 w-full"
                            placeholder="Enter the description"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="priority" className="font-semibold text-lg sm:text-xl">
                            Priority
                        </label>
                        <select
                            id="priority"
                            name="priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="rounded-lg text-base sm:text-lg p-2 w-full"
                        >
                            <option value="" disabled selected>
                                Select priority
                            </option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="dueDate" className="font-semibold text-lg sm:text-xl">
                            Due Date
                        </label>
                        <input
                            name="dueDate"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            type="date"
                            id="dueDate"
                            className="rounded-lg text-base sm:text-lg p-2 w-full"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-blue-600 transition-colors mt-4"
                    >
                        Create Todo
                    </button>
                </form>
            </div>
        </main>
    </>
);
};

export default NewTodo;
