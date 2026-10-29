
import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import apiFetch from "../utils/api";
import "./OrderDetailsPage.css";

function OrderDetailsPage() {
    const { id } = useParams();
    const [orderDetails, setOrderDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    async function getOrderDetails() {
        try {
            const response = await apiFetch(
                `http://localhost:5000/orders/${id}`,
                {},
                () => {
                    logout();
                    navigate("/login");
                }
            );

            if (!response.ok) {
                throw new Error("Failed to get order details");
            }

            const data = await response.json();
            setOrderDetails(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setLoading(true);
        setError("");
        getOrderDetails();
    }, [id]);

    if (loading) {
        return <div className="order-details-message">Loading order details...</div>;
    }

    if (error) {
        return <div className="order-details-message error-message">{error}</div>;
    }

    const totalPrice = orderDetails.reduce(
        (total, item) => total + Number(item.price) * item.quantity,
        0
    );

    const order = orderDetails[0];

    return (
        <main className="order-details-page">
            <div className="order-details-container">
                <Link to="/orders" className="back-to-orders">
                    ← Back to My Orders
                </Link>

                <header className="order-details-header">
                    <p className="order-eyebrow">MYSHOP • ORDER SUMMARY</p>
                    <h1>Order Details</h1>
                    <p className="order-number">Order #{id}</p>

                    {order && (
                        <div className="order-meta">
                            <span>
                                Date:{" "}
                                {new Date(order.orderDate).toLocaleDateString()}
                            </span>
                            <span className="order-status">
                                {order.status}
                            </span>
                        </div>
                    )}
                </header>

                {orderDetails.length === 0 ? (
                    <div className="order-details-card">
                        No items found for this order.
                    </div>
                ) : (
                    <>
                        <section className="order-details-card">
                            <h2>Items in your order</h2>

                            <div className="order-items">
                                {orderDetails.map((item) => (
                                    <article
                                        className="order-item"
                                        key={item.product_id}
                                    >
                                        <div className="order-item-image">
                                            <img
                                                src={item.image_url}
                                                alt={item.name}
                                                onError={(e) => {
                                                    e.currentTarget.style.display = "none";
                                                }}
                                            />
                                        </div>

                                        <div className="order-item-info">
                                            <h3>{item.name}</h3>
                                            <p>
                                                ₹{Number(item.price).toFixed(2)} each
                                            </p>
                                            <p>Quantity: {item.quantity}</p>
                                        </div>

                                        <strong className="order-item-subtotal">
                                            ₹
                                            {(
                                                Number(item.price) *
                                                item.quantity
                                            ).toFixed(2)}
                                        </strong>
                                    </article>
                                ))}
                            </div>

                            <div className="order-total">
                                <span>Total</span>
                                <strong>₹{totalPrice.toFixed(2)}</strong>
                            </div>
                        </section>

                        <div className="order-details-actions">
                            <Link to="/products" className="continue-shopping">
                                Continue Shopping
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}

export default OrderDetailsPage;
