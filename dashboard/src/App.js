import React, { lazy, useEffect } from "react";
import "./App.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { themeChange } from "theme-change";
import checkAuth from "./app/auth";
import initializeApp from "./app/init";

// Importing pages
const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Register = lazy(() => import("./pages/Register"));
const Documentation = lazy(() => import("./pages/Documentation"));

// Initializing different libraries
initializeApp();

// Check for login and initialize axios
const token = checkAuth();

// Define Routes using `createBrowserRouter`
const router = createBrowserRouter(
  [
    { path: "/login", element: <Login /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/register", element: <Register /> },
    { path: "/documentation", element: <Documentation /> },
    { path: "/app/*", element: <Layout /> },

    // Redirect unknown routes
    {
      path: "*",
      element: <Navigate to={token ? "/app/welcome" : "/login"} replace />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

function App() {
  useEffect(() => {
    // Initialize daisyUI themes
    themeChange(false);
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
