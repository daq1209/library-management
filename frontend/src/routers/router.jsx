import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Home from "../pages/Home/Home.jsx"
import About from "../pages/About.jsx";     
import Orders from "../pages/Orders.jsx";     
import Login from "../components/Login.jsx";
import Register from "../components/Register.jsx";
import Checkout from "../pages/books/Checkout.jsx";
import CartPage from "../pages/books/CartPage.jsx";
import Borrow from "../pages/Borrow.jsx";
import BookDetail from "../pages/books/BookDetail.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "orders", element: <Orders /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "checkout", element: <Checkout /> },
      { path: "cart", element: <CartPage /> },
      { path: "borrow", element: <Borrow /> },
      { path: "book/:id", element: <BookDetail /> },
    ],
  },
]);

export default router;
