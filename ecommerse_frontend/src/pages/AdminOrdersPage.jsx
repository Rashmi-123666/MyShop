
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import apiFetch from "../utils/api";
import { useNavigate } from "react-router-dom";
import "./AdminOrdersPage.css";

function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [error, setErrors] = useState("");
    const [loading, setLoading] = useState(true);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    async function getOrders() {
        try {
            const response = await apiFetch(
                "http://localhost:5000/admin/orders",
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
            setErrors(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getOrders();
    }, []);

    async function updateStatus(order_id, status) {
        setUpdatingOrderId(order_id);

        try {
            const response = await apiFetch(
                `http://localhost:5000/admin/orders/${order_id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ status })
                },
                () => {
                    logout();
                    navigate("/login");
                }
            );

            if (!response.ok) {
                alert("Failed to update order status");
                return;
            }

            setOrders(previousOrders =>
                previousOrders.map(order =>
                    order.order_id === order_id
                        ? { ...order, status }
                        : order
                )
            );
        } catch (err) {
            console.error("UPDATE ORDER STATUS ERROR:", err);
            alert("Unable to update status. Please try again.");
        } finally {
            setUpdatingOrderId(null);
        }
    }

    if (loading) {
        return (
            <div className="admin-orders-message">
                Loading orders...
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-orders-message admin-orders-error">
                {error}
            </div>
        );
    }

    return (
        <main className="admin-orders-page">
            <div className="admin-orders-container">
                <header className="admin-orders-header">
                    <div>
                        <p className="admin-orders-eyebrow">
                            MYSHOP MANAGEMENT
                        </p>
                        <h1>Manage Orders</h1>
                        <p className="admin-orders-subtitle">
                            View customer orders and update their status.
                        </p>
                    </div>

                    <div className="admin-orders-count">
                        <span>Total Orders</span>
                        <strong>{orders.length}</strong>
                    </div>
                </header>

                {orders.length === 0 ? (
                    <section className="admin-orders-empty">
                        <span>📦</span>
                        <h2>No orders yet</h2>
                        <p>Customer orders will appear here.</p>
                    </section>
                ) : (
                    <section className="admin-orders-list">
                        {orders.map(order => (
                            <article
                                className="admin-order-card"
                                key={order.order_id}
                            >
                                <div className="admin-order-top">
                                    <div>
                                        <p className="admin-order-label">
                                            ORDER
                                        </p>
                                        <h2>#{order.order_id}</h2>
                                    </div>

                                    <span
                                        className={`admin-order-status status-${order.status.toLowerCase()}`}
                                    >
                                        {order.status}
                                    </span>
                                </div>

                                <div className="admin-order-details">
                                    <div>
                                        <span>Customer</span>
                                        <strong>{order.name}</strong>
                                    </div>

                                    <div>
                                        <span>User ID</span>
                                        <strong>{order.user_id}</strong>
                                    </div>

                                    <div>
                                        <span>Order Date</span>
                                        <strong>
                                            {new Date(
                                                order.orderDate
                                            ).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric"
                                            })}
                                        </strong>
                                    </div>
                                </div>

                                <div className="admin-order-actions">
                                    <label htmlFor={`status-${order.order_id}`}>
                                        Update status
                                    </label>

                                    <select
                                        id={`status-${order.order_id}`}
                                        value={order.status}
                                        disabled={
                                            updatingOrderId === order.order_id
                                        }
                                        onChange={event =>
                                            updateStatus(
                                                order.order_id,
                                                event.target.value
                                            )
                                        }
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>

                                    {updatingOrderId === order.order_id && (
                                        <span className="admin-order-saving">
                                            Saving...
                                        </span>
                                    )}
                                </div>
                            </article>
                        ))}
                    </section>
                )}
            </div>
        </main>
    );
}

export default AdminOrdersPage;
