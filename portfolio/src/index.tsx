import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import reportWebVitals from "./reportWebVitals";

import Root from "./pages/root";
import ErrorPage from "./utilities/error-page";
import Home from "./pages/Home";

import "./index.css";
import "./scheme.css";
import About from "./pages/about";
import Projects from "./pages/projects";
import Blog from "./pages/blog";
import Canvas from "./pages/canvas";
import WordGuesser from "./pages/word-guesser";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "about",
        element: <About />
      },
      {
        path: "projects",
        element: <Projects />
      }, 
      {
        path: "blog",
        element: <Blog />
      }, 
      {
        path: "login",
        element: <></>
      },
      {
        path: "canvas",
        element: <Canvas />
      },
      {
        path: "wordguesser",
        element: <WordGuesser />
      }
    ],
  },
]);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
