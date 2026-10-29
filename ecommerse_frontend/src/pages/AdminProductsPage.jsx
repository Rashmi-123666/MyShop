
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import apiFetch from "../utils/api";
import { useNavigate } from "react-router-dom";
import "./AdminProductsPage.css";

const initialForm = {
    name: "",
    price: "",
    stock: "",
    category_id: "",
    image_url: ""
};

function AdminProductsPage() {
    const [products, setProducts] = useState([]);
 
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    function handleUnauthorized() {
        logout();
        navigate("/login");
    }

    async function fetchProducts() {
        setLoading(true);
        setError("");

        try {
            const response = await apiFetch(
                "http://localhost:5000/products",
                {},
                handleUnauthorized
            );

            if (!response.ok) {
                throw new Error("Unable to load products.");
            }

            const data = await response.json();
            setProducts(data.products || []);
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }


    async function fetchCategories() {
    try {
        const response = await apiFetch(
            "http://localhost:5000/categories",
            {},
            handleUnauthorized
        );

        if (!response.ok) {
            throw new Error("Unable to load categories.");
        }

        const data = await response.json();
        setCategories(data);
    } catch (err) {
        setError(err.message || "Unable to load categories.");
    }
}
    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm(previous => ({
            ...previous,
            [name]: value
        }));
    }

    function resetForm() {
        setForm(initialForm);
        setEditingId(null);
        setMessage("");
        setError("");
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSaving(true);
        setMessage("");
        setError("");

        try {
            const url = editingId
                ? `http://localhost:5000/products/${editingId}`
                : "http://localhost:5000/products";

            const response = await apiFetch(
                url,
                {
                    method: editingId ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...form,
                        price: Number(form.price),
                        stock: Number(form.stock),
                        category_id: Number(form.category_id)
                    })
                },
                handleUnauthorized
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to save product.");
            }

            setMessage(
                editingId
                    ? "Product updated successfully!"
                    : "Product added successfully!"
            );

            setForm(initialForm);
            setEditingId(null);
            await fetchProducts();
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setSaving(false);
        }
    }

    async function handleEdit(product) {
        setError("");
        setMessage("");

        try {
            const response = await apiFetch(
                `http://localhost:5000/products/${product.product_id}`,
                {},
                handleUnauthorized
            );

            if (!response.ok) {
                throw new Error("Unable to load product details.");
            }

            const data = await response.json();

            setForm({
                name: data.name ?? "",
                price: String(data.price ?? ""),
                stock: String(data.stock ?? ""),
                category_id: String(data.category_id ?? ""),
                image_url: data.image_url ?? ""
            });

            setEditingId(product.product_id);

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        } catch (err) {
            setError(err.message || "Unable to edit product.");
        }
    }

    async function handleDelete(product) {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${product.name}"?`
        );

        if (!confirmed) return;

        setError("");
        setMessage("");

        try {
            const response = await apiFetch(
                `http://localhost:5000/products/${product.product_id}`,
                {
                    method: "DELETE"
                },
                handleUnauthorized
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to delete product."
                );
            }

            setMessage("Product deleted successfully.");
            await fetchProducts();
        } catch (err) {
            setError(err.message || "Unable to delete product.");
        }
    }

    return (
        <main className="admin-products-page">
            <div className="admin-products-container">
                <header className="admin-products-header">
                    <div>
                        <p className="admin-products-eyebrow">
                            MYSHOP MANAGEMENT
                        </p>
                        <h1>Manage Products</h1>
                        <p>
                            Add new products and manage your existing inventory.
                        </p>
                    </div>

                    <div className="admin-products-count">
                        <span>Total Products</span>
                        <strong>{products.length}</strong>
                    </div>
                </header>

                {message && (
                    <div className="admin-products-message success">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="admin-products-message error">
                        {error}
                    </div>
                )}

                <section className="admin-product-form-card">
                    <h2>
                        {editingId ? "Edit Product" : "Add New Product"}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="admin-product-form-grid">
                            <div className="admin-product-field">
                                <label htmlFor="name">Product Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Enter product name"
                                    required
                                    maxLength={150}
                                />
                            </div>

                            <div className="admin-product-field">
                                <label htmlFor="price">Price (₹)</label>
                                <input
                                    id="price"
                                    name="price"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="Enter price"
                                    required
                                />
                            </div>

                            <div className="admin-product-field">
                                <label htmlFor="stock">Stock Quantity</label>
                                <input
                                    id="stock"
                                    name="stock"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={form.stock}
                                    onChange={handleChange}
                                    placeholder="Enter stock"
                                    required
                                />
                            </div>

                            <div className="admin-product-field">
                                <label htmlFor="category_id">Category</label>
                                <select
                                    id="category_id"
                                    name="category_id"
                                    value={form.category_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        Select a category
                                    </option>

                                    {categories.map(category => (
                                        <option
                                            key={category.category_id}
                                            value={category.category_id}
                                        >
                                            {category.category_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="admin-product-field full-width">
                                <label htmlFor="image_url">Image URL</label>
                                <input
                                    id="image_url"
                                    name="image_url"
                                    type="url"
                                    value={form.image_url}
                                    onChange={handleChange}
                                    placeholder="https://example.com/product.jpg"
                                />
                            </div>
                        </div>

                        <div className="admin-product-form-actions">
                            <button
                                type="submit"
                                disabled={saving}
                                className="admin-product-save-button"
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                        ? "Update Product"
                                        : "Add Product"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="admin-product-cancel-button"
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                <section className="admin-products-inventory">
                    <div className="admin-products-section-header">
                        <h2>Product Inventory</h2>
                        <span>{products.length} products</span>
                    </div>

                    {loading ? (
                        <div className="admin-products-empty">
                            Loading products...
                        </div>
                    ) : products.length === 0 ? (
                        <div className="admin-products-empty">
                            No products found.
                        </div>
                    ) : (
                        <div className="admin-products-grid">
                            {products.map(product => (
                                <article
                                    className="admin-product-card"
                                    key={product.product_id}
                                >
                                    <div className="admin-product-image">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                onError={event => {
                                                    event.currentTarget.style.display =
                                                        "none";
                                                }}
                                            />
                                        ) : (
                                            <span>No image</span>
                                        )}
                                    </div>

                                    <div className="admin-product-card-content">
                                        <span className="admin-product-category">
                                            {product.category_name}
                                        </span>

                                        <h3>{product.name}</h3>

                                        <p className="admin-product-price">
                                            ₹{Number(product.price).toLocaleString(
                                                "en-IN",
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }
                                            )}
                                        </p>

                                        <p
                                            className={
                                                Number(product.stock) === 0
                                                    ? "admin-product-stock out"
                                                    : "admin-product-stock"
                                            }
                                        >
                                            {Number(product.stock) === 0
                                                ? "Out of stock"
                                                : `${product.stock} in stock`}
                                        </p>

                                        <div className="admin-product-card-actions">
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(product)}
                                                className="admin-product-edit-button"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDelete(product)}
                                                className="admin-product-delete-button"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

export default AdminProductsPage;