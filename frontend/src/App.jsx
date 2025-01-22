import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import NewTodo from "./components/NewTodo";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<SignUp />} />
    <Route element={<ProtectedRoute />} >
      <Route path="/home" element={<Home />} />
      <Route path="/newtodo" element={<NewTodo />} />
    </Route>
    </Routes>
  );
};

export default App;
