
import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
    const { cart, setCart } = useContext(CartContext);
    const { isLoggedIn, user, logout } = useContext(AuthContext);

    const isAdmin = user?.role === "admin";

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    function handleLogout() {
        setCart([]);
        logout();
    }

    return (
        <header className="navbar">
            <Link to="/" className="navbar-brand">
                🛍️ MyShop
            </Link>

            <nav className="navbar-links">
                <NavLink to="/" end>
                    Home
                </NavLink>

                <NavLink to="/products">
                    Products
                </NavLink>

                {isLoggedIn && (
                    <>
                        <NavLink to="/orders">
                            My Orders
                        </NavLink>

                        {isAdmin && (
                            <>
                                <NavLink to="/admin/dashboard">
                                    Dashboard
                                </NavLink>

                                <NavLink to="/admin/orders">
                                    Manage Orders
                                </NavLink>

                                <NavLink to="/admin/products">
                                    Manage Products
                                </NavLink>

                                <NavLink to="/admin/categories">
                                    Manage categories
                                </NavLink>
                            </>
                        )}
                    </>
                )}
            </nav>

            <div className="navbar-actions">
                <Link to="/cart" className="navbar-cart">
                    🛒 Cart ({totalItems})
                </Link>

                {isLoggedIn ? (
                    <button
                        className="navbar-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                ) : (
                    <Link
                        to="/login"
                        className="navbar-button navbar-login"
                    >
                        Login
                    </Link>
                )}
            </div>
        </header>
    );
}

export default Navbar;