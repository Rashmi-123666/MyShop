
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthPages.css";

function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleRegister(e) {
        e.preventDefault();

        const newErrors = {};

        if (name.trim() === "") {
            newErrors.name = "Name is required";
        }

        if (email.trim() === "") {
            newErrors.email = "Email is required";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ) {
            newErrors.email = "Please enter a valid email";
        }

        if (password.trim() === "") {
            newErrors.password = "Password is required";
        } else if (password.length < 8) {
            newErrors.password =
                "Password must be at least 8 characters";
        }

        if (confirmPassword.trim() === "") {
            newErrors.confirmPassword =
                "Please confirm your password";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword =
                "Passwords do not match";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/users/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: name.trim(),
                        email: email.trim(),
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Registration failed");
                return;
            }

            alert("Registration successful!");
            navigate("/login");
        } catch (err) {
            console.error("REGISTER ERROR:", err);
            alert("Unable to connect to the server. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand-icon">🛍️</div>

                <p className="auth-eyebrow">JOIN MYSHOP</p>

                <h1>Create Account</h1>

                <p className="auth-subtitle">
                    Create an account to start shopping.
                </p>

                <form
                    onSubmit={handleRegister}
                    className="auth-form"
                    noValidate
                >
                    <div className="auth-field">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="name"
                            aria-invalid={!!errors.name}
                        />
                        {errors.name && (
                            <p className="auth-error">{errors.name}</p>
                        )}
                    </div>

                    <div className="auth-field">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                            <p className="auth-error">{errors.email}</p>
                        )}
                    </div>

                    <div className="auth-field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="At least 8 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            aria-invalid={!!errors.password}
                        />
                        {errors.password && (
                            <p className="auth-error">{errors.password}</p>
                        )}
                    </div>

                    <div className="auth-field">
                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Enter your password again"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            autoComplete="new-password"
                            aria-invalid={!!errors.confirmPassword}
                        />
                        {errors.confirmPassword && (
                            <p className="auth-error">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
