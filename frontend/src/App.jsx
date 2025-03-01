import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ViewOrderProvider } from "./Context/OrderDetail"; // Import the ViewOrderProvider
import { Index } from "./pages/Index";
import { Cart } from "./pages/Cart";
import { Profile } from "./pages/Profile";
import { Category } from "./pages/Category";
import { Bookdetail } from "./pages/Bookdetail";
import { ResellerPaymentForm } from './pages/ResellerPaymentForm';
import { BookForm } from './components/BookForm';
import { Login } from './pages/login';
import { MyOrders } from './pages/MyOrders';
import { SellOrders } from './pages/SellOrders';
import { AdminDashboard } from './pages/AdminDashboard';
import { Useraddress } from './pages/Useraddress';
import { PaymentForm } from './pages/PaymentForm';
import { AdminBookForm } from './components/AdminBookForm';
import { AdminRoute } from './pages/AdminDashboard';
import  {ManageUsers}  from './pages/ManageUsers';
import  {ManageBooks}  from './pages/ManageBooks';
import ForgotPassword from './pages/ForgotPassword';
import { Payment } from './pages/Payment';
import { BooksPage } from './pages/BooksPage';
import { AdminAddUser } from './pages/AdminAddUser';
import { AdminViewOrder } from './pages/AdminViewOrder';
import { AddCat } from './pages/AddCat';

export const App = () => {
  const router = createBrowserRouter([
        { path: "/", element: <Index /> },
        { path: "/cart", element: <Cart /> },
        { path: "/profile", element: <Profile /> },
       // { path: "/category", element: <Category /> },
        { path: "/bookdetail", element: <Bookdetail /> },
        { path: "/bookform", element:  <BookForm UserRole='Reseller'/>},
        { path: "/Resellerpaymentform", element: <ResellerPaymentForm /> },
        { path: "/login", element: <Login/> },
        { path: "/Orders" ,  element: <MyOrders/>},
        { path: "/SellOrders", element:<SellOrders/>},
        { path: "/Admin", element: <AdminRoute><AdminDashboard/></AdminRoute>},
        { path: "/Useraddress", element: <Useraddress /> },
        { path: "/PaymentForm", element: <PaymentForm /> },
        { path: "/Admin/ManageBooks/AddBook" , element : <AdminRoute><AdminBookForm UserRole='Admin'/></AdminRoute>},
        { path: "/Admin/ManageUsers" , element : <AdminRoute><ManageUsers/></AdminRoute>},
        { path: "/Admin/ManageBooks" , element : <AdminRoute><ManageBooks/></AdminRoute>},
        { path: "/MyOrder", element: <MyOrders /> },
        { path: "/ForgotPassword" ,element:<ForgotPassword/>},
        {path : "/payment", element:<Payment/>},
        {path : "/books/:category/:subcategory", element:<BooksPage/>},
        {path : "/Admin/ManageUsers/adduser" ,  element: <AdminRoute><AdminAddUser/></AdminRoute>},
        {path : "/Admin/ViewOrder" , element : <AdminRoute><AdminViewOrder/></AdminRoute> },
        { path : "/Admin/AddCat" , element:  <AdminRoute><AddCat/></AdminRoute> }
  ]);

  return (
      <RouterProvider router={router} />
    )
};
