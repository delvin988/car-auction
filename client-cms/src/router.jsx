import { createBrowserRouter, redirect } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import LayoutPage from "./pages/LayoutPage";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";

const CheckUser = () => {
  if (!localStorage.getItem("access_token")) {
    return redirect("/login");
  }
  return null;
};

const router = createBrowserRouter([
  {
    element: <LayoutPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/add-item",
        element: <AddItem />,
      },
      {
        path: "/edit-item/:id",
        element: <EditItem />,
      },
    ],

    loader: CheckUser,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default router;
