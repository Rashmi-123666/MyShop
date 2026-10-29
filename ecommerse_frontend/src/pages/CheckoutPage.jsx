
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import apiFetch from "../utils/api";
import "./CheckoutPage.css";

function CheckoutPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: ""
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const { cart, setCart } = useContext(CartContext);
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const totalPrice = cart.reduce(
        (total, item) =>
            total + item.product.price * item.quantity,
        0
    );

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty");
            return;
        }

        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Enter a valid email address";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = "Enter a valid 10-digit phone number";
        }

        if (!formData.address.trim()) {
            newErrors.address = "Address is required";
        }

        if (!formData.city.trim()) {
            newErrors.city = "City is required";
        }

        if (!formData.state.trim()) {
            newErrors.state = "State is required";
        }

        if (!formData.pincode.trim()) {
            newErrors.pincode = "PIN code is required";
        } else if (!/^\d{6}$/.test(formData.pincode)) {
            newErrors.pincode = "Enter a valid 6-digit PIN code";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        try {
            setSubmitting(true);

            const response = await apiFetch(
                "http://localhost:5000/orders",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                },
                () => {
                    logout();
                    setCart([]);
                    navigate("/login");
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to place order");
                return;
            }

            setCart([]);
            alert("Order placed successfully!");
            navigate("/orders");
        } catch (err) {
            console.error("PLACE ORDER ERROR:", err);
            alert("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="checkout-page">
            <div className="checkout-header">
                <p className="checkout-eyebrow">ALMOST YOURS</p>
                <h1>Checkout</h1>
                <p>Enter your details to complete your order.</p>
            </div>

            {cart.length === 0 ? (
                <section className="checkout-empty">
                    <h2>Your cart is empty</h2>
                    <p>Add some products before proceeding to checkout.</p>
                    <Link to="/products" className="checkout-primary-btn">
                        Continue Shopping
                    </Link>
                </section>
            ) : (
                <>
                    <section className="checkout-card">
                        <div className="checkout-section-heading">
                            <span className="checkout-step">01</span>
                            <div>
                                <h2>Customer Details</h2>
                                <p>Where should we deliver your order?</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="checkout-form-grid">
                                <div className="checkout-field">
                                    <label htmlFor="name">Full Name</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={errors.name ? "input-error" : ""}
                                    />
                                    {errors.name && (
                                        <p className="field-error">{errors.name}</p>
                                    )}
                                </div>

                                <div className="checkout-field">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={errors.email ? "input-error" : ""}
                                    />
                                    {errors.email && (
                                        <p className="field-error">{errors.email}</p>
                                    )}
                                </div>

                                <div className="checkout-field">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="10-digit mobile number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={errors.phone ? "input-error" : ""}
                                    />
                                    {errors.phone && (
                                        <p className="field-error">{errors.phone}</p>
                                    )}
                                </div>

                                <div className="checkout-field checkout-full-width">
                                    <label htmlFor="address">Delivery Address</label>
                                    <input
                                        id="address"
                                        name="address"
                                        type="text"
                                        placeholder="House number, street, area"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className={errors.address ? "input-error" : ""}
                                    />
                                    {errors.address && (
                                        <p className="field-error">{errors.address}</p>
                                    )}
                                </div>

                                <div className="checkout-field">
                                    <label htmlFor="city">City</label>
                                    <input
                                        id="city"
                                        name="city"
                                        type="text"
                                        placeholder="Enter your city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className={errors.city ? "input-error" : ""}
                                    />
                                    {errors.city && (
                                        <p className="field-error">{errors.city}</p>
                                    )}
                                </div>

                                <div className="checkout-field">
                                    <label htmlFor="state">State</label>
                                    <input
                                        id="state"
                                        name="state"
                                        type="text"
                                        placeholder="Enter your state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className={errors.state ? "input-error" : ""}
                                    />
                                    {errors.state && (
                                        <p className="field-error">{errors.state}</p>
                                    )}
                                </div>

                                <div className="checkout-field">
                                    <label htmlFor="pincode">PIN Code</label>
                                    <input
                                        id="pincode"
                                        name="pincode"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={6}
                                        placeholder="6-digit PIN code"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        className={errors.pincode ? "input-error" : ""}
                                    />
                                    {errors.pincode && (
                                        <p className="field-error">{errors.pincode}</p>
                                    )}
                                </div>
                            </div>

                            <p className="checkout-form-note">
                                Please check your details before placing the order.
                            </p>

                            <button
                                type="submit"
                                className="checkout-primary-btn checkout-place-btn"
                                disabled={submitting}
                            >
                                {submitting ? "Placing Order..." : "Place Order"}
                            </button>
                        </form>
                    </section>

                    <section className="checkout-card checkout-summary">
                        <div className="checkout-section-heading">
                            <span className="checkout-step">02</span>
                            <div>
                                <h2>Order Summary</h2>
                                <p>Review the items in your order.</p>
                            </div>
                        </div>

                        <div className="summary-items">
                            {cart.map(item => (
                                <div
                                    className="summary-item"
                                    key={item.product.product_id}
                                >
                                    <div className="summary-product-info">
                                        <h3>{item.product.name}</h3>
                                        <p>
                                            ₹{Number(item.product.price).toLocaleString("en-IN")}
                                            {" "}× {item.quantity}
                                        </p>
                                    </div>

                                    <p className="summary-subtotal">
                                        ₹{(
                                            item.product.price * item.quantity
                                        ).toLocaleString("en-IN", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="summary-total">
                            <span>Total Amount</span>
                            <strong>
                                ₹{totalPrice.toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </strong>
                        </div>

                        <p className="summary-footer">
                            Your order total is calculated from the items in your cart.
                        </p>
                    </section>
                </>
            )}
        </main>
    );
}

export default CheckoutPage;
