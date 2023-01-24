import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "views/Layout";
import Home from "views/Home";
import AddUser from "views/AddUser";
import EditUser from "views/EditUser";
import UserDetails from "views/UserDetails";
import NotFound from "views/NotFound";

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "add",
        element: <AddUser />,
      },
      {
        path: "edit/:id",
        element: <EditUser />,
      },
      {
        path: "user/:id",
        element: <UserDetails />,
      },
    ]
  },
  {
    path: "*",
    element: <NotFound />,
  }
];

const router = createBrowserRouter(routes);

export default function Routers(children) {
  return (
    <RouterProvider router={router}>
      {children}
    </RouterProvider>
  );
}