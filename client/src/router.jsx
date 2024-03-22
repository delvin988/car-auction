import { createBrowserRouter, redirect } from "react-router-dom";
import Layout from "./page/layout.jsx";
import LoginPage from "./page/login.jsx";
import Home from "./page/home.jsx";
import Register from "./page/register.jsx";
import BidPage from "./page/BidPage.jsx";
import MyBid from "./page/mybid.jsx";

// eslint-disable-next-line react-refresh/only-export-components
const CheckUser = () => {
  if (!localStorage.getItem("access_token")) {
    return redirect("/login");
  }
  return null;
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/bid/:id",
        element: <BidPage />,
      },
      {
        path: "/mybid",
        element: <MyBid />,
      },
    ],
    loader: CheckUser,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default router;
