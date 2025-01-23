import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import NewTodo from "./components/NewTodo";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./components/Profile";
import AlerdyLogin from "./components/AlerdyLogin";

const App = () => {
  return (
    <Routes>
      <Route element={<AlerdyLogin />}>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<SignUp />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/newtodo" element={<NewTodo />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default App;
