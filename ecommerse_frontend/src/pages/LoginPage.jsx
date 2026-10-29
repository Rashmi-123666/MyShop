
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./AuthPages.css";

function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });

        setErrors({
            ...errors,
            [name]: ""
        });

        setServerError("");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const newErrors = {};

        if (formData.email.trim() === "") {
            newErrors.email = "Email is required";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            newErrors.email = "Please enter a valid email address";
        }

        if (formData.password.trim() === "") {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password =
                "Password must be at least 8 characters";
        }

        setErrors(newErrors);
        setServerError("");

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setServerError(
                    data.message || "Login failed. Please try again."
                );
                return;
            }

            login(data.token);
            navigate("/");
        } catch (err) {
            console.error("LOGIN ERROR:", err);
            setServerError(
                "Unable to connect to the server. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">🛍️</div>

                <p className="auth-eyebrow">WELCOME BACK</p>

                <h1>Login to MyShop</h1>

                <p className="auth-subtitle">
                    Enter your details to continue shopping.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="auth-form"
                    noValidate
                >
                    <label htmlFor="email">
                        Email Address
                    </label>

                    <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        aria-invalid={Boolean(errors.email)}
                    />

                    {errors.email && (
                        <p className="auth-error">
                            {errors.email}
                        </p>
                    )}

                    <label htmlFor="password">
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        aria-invalid={Boolean(errors.password)}
                    />

                    {errors.password && (
                        <p className="auth-error">
                            {errors.password}
                        </p>
                    )}

                    {serverError && (
                        <p className="auth-error">
                            {serverError}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account?{" "}
                    <Link to="/register">Create Account</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
