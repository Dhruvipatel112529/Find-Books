import React, { useEffect, useState } from "react";
import "../pages-css/AdminDashboard.css";
import { FaBook, FaBookOpen, FaHome } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { Navigate, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AdminContext";
import Load from "../components/Load";
import { MdAdminPanelSettings } from "react-icons/md";
import { MdReport } from "react-icons/md";
import Cookies from "js-cookie";
import { FaTruckMoving } from "react-icons/fa";
import { useViewOrder } from "../Context/OrderDetail";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div>
        <Load />
      </div>
    );
  }

  if (!user || user.isAdmin !== true) {
    return <Navigate to="/" />;
  }

  return children;
};

const AdminDashboard = () => {
  const [user, getUser] = useState({});
  const [users, setUsers] = useState([]);
  const [bookdata, setBookdata] = useState([]);
  const [orders, setOrders] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const { setOrderDetails } = useViewOrder();

  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");
    getUser(null);
    navigate("/");
  };

  useEffect(() => {
    const GetUser = async () => {
      try {
        const response = await fetch("http://localhost:2606/api/User", {
          credentials: "include",
        });
        const json = await response.json();
        getUser(json.user);
      } catch (error) {
        alert("An error occurred. Please try again later.");
        console.error(error);
      }
    };

    GetUser();
    const getOrders = async () => {
      try {
        const response = await fetch("http://localhost:2606/api/Orders", {
          credentials: "include",
        });
        const json = await response.json();
        console.log("Fetched Orders:", json.orders);
        setOrders(json.orders);
      } catch (error) {
        alert("An error occurred. Please try again later.");
        console.error(error);
      }
    };

    getOrders();

    const GetUsers = async () => {
      try {
        const response = await fetch("http://localhost:2606/api/AllUser", {
          credentials: "include",
        });
        const json = await response.json();
        setUsers(json.users);
      } catch (error) {
        alert("An error occurred. Please try again later.");
        console.error(error);
      }
    };

    GetUsers();

    const fetchBook = async () => {
      try {
        const res = await fetch("http://localhost:2606/api/Book");
        const data = await res.json();
        setBookdata(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBook();
  }, []);

  useEffect(() => {
    const getRevenue = async () => {
      try {
        const res = await fetch("http://localhost:2606/api/verify", {
          credentials: "include",
        });
        const data = await res.json();

        const totalRevenue = data.payment.reduce((acc, pdata) => {
          const transactionType = pdata.transaction_Type?.toLowerCase();
          const paymentStatus = pdata.payment_status?.toLowerCase();
          const amount = pdata.total_payment || 0;

          if (paymentStatus === "completed") {
            if (transactionType === "credit") {
              return acc + amount;
            } else if (transactionType === "debit") {
              return acc - amount;
            }
          }
          return acc;
        }, 0);

        setRevenue(totalRevenue);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    getRevenue();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, Order_Status: newStatus } : order
      )
    );

    try {
      const response = await fetch(
        `http://localhost:2606/api/${orderId}/Order`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                Order_Status: newStatus === "Shipped" ? "pending" : "Shipped",
              }
            : order
        )
      );
    }
  };

  const viewOrder = (orderdata, bookdata) => {
    const userdata = users.find((data) => data._id === orderdata.User_id);

    const filteredBooks = orderdata.books
      .map((bdata) => {
        const bookInfo = bookdata.find((data) => data._id === bdata.book_id);
        return bookInfo
          ? { ...bookInfo, book_quantity: bdata.book_quantity }
          : null;
      })
      .filter((book) => book !== null);

    setOrderDetails({ orderdata, userdata, bookdata: filteredBooks });
    navigate("/Admin/ViewOrder");
  };

  return (
    <div className="admin-dashboard-container">
      <aside className="sidebar">
        <h2>
          <MdAdminPanelSettings />
          Admin Panel
        </h2>
        <nav>
          <ul>
            <li>
              <NavLink to="/">
                <FaHome /> Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/Admin/ManageUsers">
                <FaUsers /> Users
              </NavLink>
            </li>
            <li>
              <NavLink to="/Admin/Orders">
                <FaTruckMoving /> Orders
              </NavLink>
            </li>
            <li>
              <NavLink to="/Admin/ManageBooks">
                <FaBookOpen /> Books
              </NavLink>
            </li>
            <li>
              <NavLink to="/Admin/AddCat">
                <FaBook /> Category
              </NavLink>
            </li>
            <li>
              <NavLink to="/Admin/Reports">
                <MdReport /> Reports
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <div className="header-div">
          <header className="dashboard-header">
            <h1>Welcome, {user.First_name}</h1>
            <button className="logout-btn" onClick={handleLogout}>
              Log Out
            </button>
          </header>
        </div>
        <section className="statistics">
          <div
            className="stat-card"
            onClick={() => navigate("/Admin/ManageUsers")}
          >
            <h3>Users</h3>
            <p>{users.length}</p>
          </div>
          <div className="stat-card">
            <h3>Orders</h3>
            <p>{orders.length}</p>
          </div>
          <div className="stat-card">
            <h3>Revenue</h3>
            <p>₹{revenue}</p>
          </div>
          <div
            className="stat-card"
            onClick={() => navigate("/Admin/ManageBooks")}
          >
            <h3>Books</h3>
            <p>{bookdata.length}</p>
          </div>
        </section>
        <section className="data-table">
          <h2>Recent Orders</h2>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Action</th>
                <th>Shipped</th>
              </tr>
            </thead>
            <tbody>
  {orders
    .filter((order) => {
      return (
        order.Order_Status.toLowerCase() === "shipped" ||
        order.Order_Status.toLowerCase() === "pending"
      );
    })
    .map((order) => {
      const userDetail = users.find((user) => user._id === order.User_id);
      const userName = userDetail
        ? `${userDetail.First_name} ${userDetail.Last_name}`
        : "Unknown User";

      return (
        <tr key={order._id}>
          <td>{order._id}</td>
          <td>{userName}</td> {/* Display User's Full Name */}
          <td>{order.Order_Status}</td>
          <td>{order.Total_Amount}</td>
          <td>
            <button
              className="action-btn"
              onClick={() => viewOrder(order, bookdata)}
            >
              View
            </button>
          </td>
          <td>
            {order.Order_Status.toLowerCase() === "shipped" ? (
              <button
                className="action-btn"
                onClick={() => updateOrderStatus(order._id, "pending")}
              >
                Pending
              </button>
            ) : (
              <button
                className="action-btn"
                onClick={() => updateOrderStatus(order._id, "shipped")}
              >
                Shipped
              </button>
            )}
          </td>
        </tr>
      );
    })}
</tbody>

          </table>
        </section>
      </main>
    </div>
  );
};

export { AdminDashboard, AdminRoute };
