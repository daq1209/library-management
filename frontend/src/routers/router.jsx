// frontend/src/routers/router.jsx
import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Home from "../pages/Home/Home.jsx";
import About from "../pages/About.jsx";
import Orders from "../pages/Orders.jsx";
import Login from "../components/Login.jsx";
import Register from "../components/Register.jsx";
import Checkout from "../pages/Checkout.jsx";
import PaymentSuccess from "../pages/PaymentSuccess.jsx";
import CartPage from "../pages/books/Cartpage.jsx";
import Borrow from "../pages/Borrow.jsx";
import BookDetail from "../pages/books/BookDetail.jsx";
import Wishlist from "../pages/Wishlist.jsx";
import BookSearch from "../pages/books/BookSearch.jsx";
import Profile from "../pages/Profile.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Public
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "borrow", element: <Borrow /> },
      { path: "book/:id", element: <BookDetail /> },
      { path: "search", element: <BookSearch /> },

      // Protected
      {
        element: <PrivateRoute />,
        children: [
          { path: "profile", element: <Profile /> },
          { path: "orders", element: <Orders /> },
          { path: "wishlist", element: <Wishlist /> },
          { path: "checkout", element: <Checkout /> },
          { path: "cart", element: <CartPage /> },
          { path: "payment-success", element: <PaymentSuccess /> },
        ],
      },

      // Admin chỉ cho role admin
      {
        path: "admin",
        element: (
          <PrivateRoute role="admin">
            <AdminDashboard />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
