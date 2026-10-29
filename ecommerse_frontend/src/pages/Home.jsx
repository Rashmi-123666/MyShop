
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const API_URL = "http://localhost:5000";

const categoryIcons = {
    Electronics: "💻",
    Footwear: "👟",
    "Books & Stationery": "📚",
    Clothing: "👕",
    Accessories: "⌚",
    "Beauty & Personal Care": "🧴",
    "Home & Kitchen": "🏠",
    "Sports & Fitness": "🏋️"
};

function Home() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const [categoryResponse, productResponse] =
                    await Promise.all([
                        fetch(`${API_URL}/categories`),
                        fetch(`${API_URL}/products`)
                    ]);

                if (!categoryResponse.ok || !productResponse.ok) {
                    throw new Error("Unable to load homepage data");
                }

                const categoryData = await categoryResponse.json();
                const productData = await productResponse.json();

                setCategories(
                    Array.isArray(categoryData)
                        ? categoryData
                        : categoryData.categories || []
                );

                setProducts(
                    Array.isArray(productData)
                        ? productData
                        : productData.products || []
                );
            } catch (error) {
                console.error("Homepage loading error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    const featuredProducts = products.slice(0, 4);

    const newArrivals = [...products]
        .sort((a, b) => b.product_id - a.product_id)
        .slice(0, 4);

    return (
        <main className="home-page">

            {/* HERO SECTION */}
            <section className="home-hero">

                <div className="hero-content">
                    <p className="hero-eyebrow">
                        WELCOME TO MYSHOP
                    </p>

                    <h1>
                        Discover Products
                        <span> That You Love.</span>
                    </h1>

                    <p className="hero-description">
                        From everyday essentials to your favorite gadgets,
                        explore a collection of products all in one place.
                    </p>

                    <div className="hero-buttons">
                        <Link to="/products" className="shop-button">
                            Shop Now <span>→</span>
                        </Link>

                        <a href="#categories" className="explore-button">
                            Explore Categories
                        </a>
                    </div>

                    <div className="hero-note">
                        ✨ Simple shopping. Everything in one place.
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="hero-image-circle">
                        <span>🛍️</span>
                    </div>
                    <span className="hero-decoration decoration-one">✦</span>
                    <span className="hero-decoration decoration-two">✧</span>
                    <span className="hero-package">📦</span>
                </div>

            </section>

            {/* CATEGORY SECTION */}
            <section className="home-section" id="categories">

                <div className="section-heading">
                    <div>
                        <p className="section-eyebrow">EXPLORE MYSHOP</p>
                        <h2>Shop by Category</h2>
                        <p className="section-description">
                            Find exactly what you are looking for.
                        </p>
                    </div>

                    <Link to="/products" className="view-all">
                        View All Products →
                    </Link>
                </div>

                {loading ? (
                    <p className="home-message">Loading categories...</p>
                ) : (
                    <div className="category-grid">
                        {categories.map((category) => (
                            <Link
                                key={category.category_id}
                                to={`/products?category=${category.category_id}`}
                                className="category-card"
                            >
                                <span className="category-icon">
                                    {categoryIcons[category.category_name] || "🛍️"}
                                </span>

                                <h3>{category.category_name}</h3>

                                <span className="category-link">
                                    Explore Category →
                                </span>
                            </Link>
                        ))}
                    </div>
                )}

            </section>

            {/* FEATURED PRODUCTS */}
            <section className="home-section">

                <div className="section-heading">
                    <div>
                        <p className="section-eyebrow">HANDPICKED FOR YOU</p>
                        <h2>Featured Products</h2>
                        <p className="section-description">
                            Explore some of the products available at MyShop.
                        </p>
                    </div>

                    <Link to="/products" className="view-all">
                        View All →
                    </Link>
                </div>

                {loading ? (
                    <p className="home-message">Loading products...</p>
                ) : (
                    <div className="home-product-grid">
                        {featuredProducts.map((product) => (
                            <article
                                className="home-product-card"
                                key={product.product_id}
                            >
                                <Link
                                    to="/products"
                                    className="home-product-image"
                                >
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            onError={(event) => {
                                                event.currentTarget.style.display = "none";
                                            }}
                                        />
                                    ) : (
                                        <span>🛍️</span>
                                    )}
                                </Link>

                                <div className="home-product-info">
                                    <h3>{product.name}</h3>

                                    <p className="home-product-price">
                                        ₹{Number(product.price).toLocaleString("en-IN", {
                                            minimumFractionDigits: 2
                                        })}
                                    </p>

                                    <p className="home-product-stock">
                                        {product.stock > 0
                                            ? `${product.stock} available`
                                            : "Out of stock"}
                                    </p>

                                    <Link
                                        to="/products"
                                        className="product-shop-link"
                                    >
                                        Explore Product →
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

            </section>

            {/* NEW ARRIVALS */}
            <section className="new-arrivals-section">

                <div className="new-arrivals-content">
                    <p className="section-eyebrow">JUST ADDED</p>
                    <h2>Discover Our New Arrivals</h2>
                    <p>
                        Explore the latest additions to our product collection
                        and find something new for yourself.
                    </p>

                    <Link to="/products" className="shop-button">
                        Explore Products →
                    </Link>
                </div>

                <div className="new-arrivals-visual">
                    <span>🎁</span>
                    <span>✨</span>
                </div>

            </section>

            {/* NEW ARRIVAL PRODUCTS */}
            <section className="home-section">

                <div className="section-heading">
                    <div>
                        <p className="section-eyebrow">FRESH COLLECTION</p>
                        <h2>Recently Added</h2>
                    </div>

                    <Link to="/products" className="view-all">
                        Shop Everything →
                    </Link>
                </div>

                {!loading && (
                    <div className="home-product-grid">
                        {newArrivals.map((product) => (
                            <article
                                className="home-product-card"
                                key={product.product_id}
                            >
                                <div className="new-badge">New Arrival</div>

                                <div className="home-product-image">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            onError={(event) => {
                                                event.currentTarget.style.display = "none";
                                            }}
                                        />
                                    ) : (
                                        <span>🛍️</span>
                                    )}
                                </div>

                                <div className="home-product-info">
                                    <h3>{product.name}</h3>

                                    <p className="home-product-price">
                                        ₹{Number(product.price).toLocaleString("en-IN", {
                                            minimumFractionDigits: 2
                                        })}
                                    </p>

                                    <Link
                                        to="/products"
                                        className="product-shop-link"
                                    >
                                        Shop Now →
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

            </section>

            {/* WHY CHOOSE US */}
            <section className="why-shop-section">

                <div className="why-shop-heading">
                    <p className="section-eyebrow">THE MYSHOP EXPERIENCE</p>
                    <h2>Why Shop With Us?</h2>
                    <p>
                        We make your shopping experience simple and convenient.
                    </p>
                </div>

                <div className="benefits-grid">

                    <div className="benefit-card">
                        <span>🛒</span>
                        <h3>Easy Shopping</h3>
                        <p>
                            Browse different categories and explore products
                            easily.
                        </p>
                    </div>

                    <div className="benefit-card">
                        <span>🔐</span>
                        <h3>Your Account</h3>
                        <p>
                            Access your account and manage your shopping
                            activities.
                        </p>
                    </div>

                    <div className="benefit-card">
                        <span>📦</span>
                        <h3>Order Tracking</h3>
                        <p>
                            Check your orders and follow their status.
                        </p>
                    </div>

                    <div className="benefit-card">
                        <span>💬</span>
                        <h3>Simple Experience</h3>
                        <p>
                            Enjoy a clean and easy-to-use shopping interface.
                        </p>
                    </div>

                </div>

            </section>

            {/* FINAL SHOPPING BANNER */}
            <section className="final-shop-banner">
                <div>
                    <h2>Ready to Find Your Favorites?</h2>
                    <p>Explore the MyShop collection today.</p>
                </div>

                <Link to="/products" className="shop-button">
                    Start Shopping →
                </Link>
            </section>

        </main>
    );
}

export default Home;
