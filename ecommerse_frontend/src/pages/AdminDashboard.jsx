
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import apiFetch from "../utils/api";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setErrors] = useState("");

    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    async function getDashboard() {
        try {
            const response = await apiFetch(
                "http://localhost:5000/admin/dashboard",
                {},
                () => {
                    logout();
                    navigate("/login");
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch dashboard");
            }

            const data = await response.json();
            setDashboard(data);
        } catch (err) {
            setErrors(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getDashboard();
    }, []);

    if (loading) {
        return (
            <div className="admin-dashboard-message">
                Loading dashboard...
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-dashboard-message admin-dashboard-error">
                {error}
            </div>
        );
    }

    const stats = [
        {
            title: "Total Users",
            value: dashboard.totalUsers,
            icon: "👥",
            description: "Registered customers",
            color: "blue"
        },
        {
            title: "Total Products",
            value: dashboard.totalProducts,
            icon: "📦",
            description: "Products in store",
            color: "purple"
        },
        {
            title: "Total Categories",
            value: dashboard.totalCategories,
            icon: "🗂️",
            description: "Product categories",
            color: "orange"
        },
        {
            title: "Total Orders",
            value: dashboard.totalOrders,
            icon: "🛍️",
            description: "Orders placed",
            color: "green"
        },
        {
            title: "Total Revenue",
            value: `₹${Number(dashboard.totalRevenue).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`,
            icon: "💰",
            description: "From delivered orders",
            color: "pink"
        }
    ];

    return (
        <main className="admin-dashboard-page">
            <div className="admin-dashboard-container">
                <header className="admin-dashboard-header">
                    <div>
                        <p className="admin-dashboard-eyebrow">
                            MYSHOP MANAGEMENT
                        </p>
                        <h1>Admin Dashboard</h1>
                        <p className="admin-dashboard-subtitle">
                            Here's an overview of your store.
                        </p>
                    </div>
                    <div className="admin-dashboard-badge">
                        ⚙️ Admin Panel
                    </div>
                </header>

                <section className="admin-stats-grid">
                    {stats.map((stat) => (
                        <article
                            className="admin-stat-card"
                            key={stat.title}
                        >
                            <div className="admin-stat-top">
                                <div className="admin-stat-text">
                                    <p>{stat.title}</p>
                                    <h2>{stat.value}</h2>
                                </div>

                                <div
                                    className={`admin-stat-icon ${stat.color}`}
                                >
                                    {stat.icon}
                                </div>
                            </div>

                            <div className="admin-stat-description">
                                {stat.description}
                            </div>
                        </article>
                    ))}
                </section>

                <section className="admin-dashboard-note">
                    <span className="admin-note-icon">📊</span>
                    <div>
                        <h3>Store Overview</h3>
                        <p>
                            Monitor your users, products, categories, orders,
                            and revenue from this dashboard.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default AdminDashboard;
