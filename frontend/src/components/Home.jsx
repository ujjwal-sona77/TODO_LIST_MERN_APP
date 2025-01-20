import axios from "axios";
import React, { useState, useEffect } from "react";

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

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Todos</h1>

        {/* Add Todo Button */}
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg mb-6">
          Add New Todo
        </button>

    {todos.map((todo)=>(
        <div key={todo._id}>
            {todo.title}
            {todo.description}
            {todo.status}
        </div>
    ))}

        {todos.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No todos found. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
