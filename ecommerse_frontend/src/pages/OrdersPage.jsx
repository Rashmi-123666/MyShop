
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import apiFetch from "../utils/api";
import "./OrdersPage.css";

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [error, setErrors] = useState("");
    const [loading, setLoading] = useState(true);

    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    async function getOrders() {
        try {
            const response = await apiFetch(
                "http://localhost:5000/orders",
                {},
                () => {
                    logout();
                    navigate("/login");
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch orders");
            }

            const data = await response.json();
            setOrders(data);
        } catch (err) {
            setErrors(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getOrders();
    }, []);

    if (loading) {
        return (
            <div className="orders-page">
                <p className="orders-message">Loading your orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="orders-page">
                <p className="orders-error">{error}</p>
                <Link to="/products" className="orders-primary-button">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <main className="orders-page">
            <header className="orders-header">
                <p className="orders-eyebrow">YOUR SHOPPING JOURNEY</p>
                <h1>My Orders</h1>
                <p className="orders-subtitle">
                    View your purchases and track their status.
                </p>
            </header>

            {orders.length === 0 ? (
                <section className="orders-empty">
                    <div className="orders-empty-icon">🛍️</div>
                    <h2>No orders yet</h2>
                    <p>
                        You haven't placed any orders. Find something
                        you love and it will appear here.
                    </p>
                    <Link to="/products" className="orders-primary-button">
                        Start Shopping
                    </Link>
                </section>
            ) : (
                <section className="orders-list">
                    <div className="orders-count">
                        {orders.length} {orders.length === 1 ? "order" : "orders"}
                    </div>

                    {orders.map((order) => {
                        const status = (order.status || "Pending").toLowerCase();
                        const statusClass = [
                            "pending",
                            "processing",
                            "shipped",
                            "delivered",
                            "cancelled"
                        ].includes(status)
                            ? status
                            : "pending";

                        const date = order.orderDate
                            ? new Date(order.orderDate).toLocaleDateString(
                                  "en-IN",
                                  {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric"
                                  }
                              )
                            : "Date unavailable";

                        return (
                            <article
                                className="order-card"
                                key={order.order_id}
                            >
                                <div className="order-card-top">
                                    <div>
                                        <p className="order-label">
                                            ORDER NUMBER
                                        </p>
                                        <h2>
                                            #{order.order_id}
                                        </h2>
                                    </div>

                                    <span
                                        className={`order-status ${statusClass}`}
                                    >
                                        {order.status || "Pending"}
                                    </span>
                                </div>

                                <div className="order-card-bottom">
                                    <div>
                                        <p className="order-label">
                                            ORDER DATE
                                        </p>
                                        <p className="order-date">
                                            {date}
                                        </p>
                                    </div>

                                    <Link
                                        to={`/orders/${order.order_id}`}
                                        className="order-details-link"
                                    >
                                        View Details <span>→</span>
                                    </Link>
                                </div>
                            </article>
                        );
                    })}

                    <Link
                        to="/products"
                        className="orders-continue-link"
                    >
                        ← Continue Shopping
                    </Link>
                </section>
            )}
        </main>
    );
}

export default OrdersPage;