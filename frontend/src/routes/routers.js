import * as React from "react";

// views
import Layout from "views/Layout";
import Home from "views/Home";
import AddUser from "views/AddUser";
import EditUser from "views/EditUser";
import UserDetails from "views/UserDetails";
import NotFound from "views/NotFound";
import { useRoutes } from "react-router-dom";

const routesConfig = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
        // modals
        children: [
          {
            path: "/add",
            element: <AddUser />,
          },
          {
            path: "/edit/:id",
            element: <EditUser />,
          },
          {
            path: "/user/:id",
            element: <UserDetails />,
          },
        ],
      },
    ]
  },
  {
    path: "*",
    element: <NotFound />,
  }
];

export default function Routers() {
  const routes = useRoutes(routesConfig);
  return routes;
}