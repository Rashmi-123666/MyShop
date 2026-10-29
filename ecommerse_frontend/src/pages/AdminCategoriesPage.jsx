
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import apiFetch from "../utils/api";
import { useNavigate } from "react-router-dom";
import "./AdminCategoriesPage.css";

function AdminCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState("");
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

    async function fetchCategories() {
        setLoading(true);
        setError("");

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
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    function resetForm() {
        setCategoryName("");
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
                ? `http://localhost:5000/categories/${editingId}`
                : "http://localhost:5000/categories";

            const response = await apiFetch(
                url,
                {
                    method: editingId ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        category_name: categoryName.trim()
                    })
                },
                handleUnauthorized
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to save category.");
            }

            setMessage(
                editingId
                    ? "Category updated successfully!"
                    : "Category added successfully!"
            );

            setCategoryName("");
            setEditingId(null);

            await fetchCategories();
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setSaving(false);
        }
    }

    function handleEdit(category) {
        setCategoryName(category.category_name);
        setEditingId(category.category_id);
        setMessage("");
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    async function handleDelete(category) {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${category.category_name}"?`
        );

        if (!confirmed) return;

        setMessage("");
        setError("");

        try {
            const response = await apiFetch(
                `http://localhost:5000/categories/${category.category_id}`,
                {
                    method: "DELETE"
                },
                handleUnauthorized
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to delete category.");
            }

            setMessage("Category deleted successfully.");
            await fetchCategories();
        } catch (err) {
            setError(err.message || "Unable to delete category.");
        }
    }

    return (
        <main className="admin-categories-page">
            <div className="admin-categories-container">

                <header className="admin-categories-header">
                    <div>
                        <p className="admin-categories-eyebrow">
                            MYSHOP MANAGEMENT
                        </p>
                        <h1>Manage Categories</h1>
                        <p>
                            Add and organize categories for your products.
                        </p>
                    </div>

                    <div className="admin-categories-count">
                        <span>Total Categories</span>
                        <strong>{categories.length}</strong>
                    </div>
                </header>

                {message && (
                    <div className="admin-categories-message success">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="admin-categories-message error">
                        {error}
                    </div>
                )}

                <section className="admin-category-form-card">
                    <h2>
                        {editingId ? "Edit Category" : "Add New Category"}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="admin-category-field">
                            <label htmlFor="category_name">
                                Category Name
                            </label>

                            <input
                                id="category_name"
                                type="text"
                                value={categoryName}
                                onChange={(event) =>
                                    setCategoryName(event.target.value)
                                }
                                placeholder="Enter category name"
                                maxLength={100}
                                required
                            />
                        </div>

                        <div className="admin-category-form-actions">
                            <button
                                type="submit"
                                disabled={saving || !categoryName.trim()}
                                className="admin-category-save-button"
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                        ? "Update Category"
                                        : "Add Category"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="admin-category-cancel-button"
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                <section className="admin-categories-list-section">
                    <div className="admin-categories-section-header">
                        <h2>All Categories</h2>
                        <span>{categories.length} categories</span>
                    </div>

                    {loading ? (
                        <div className="admin-categories-empty">
                            Loading categories...
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="admin-categories-empty">
                            No categories found.
                        </div>
                    ) : (
                        <div className="admin-categories-list">
                            {categories.map((category) => (
                                <article
                                    className="admin-category-card"
                                    key={category.category_id}
                                >
                                    <div>
                                        <span className="admin-category-label">
                                            CATEGORY
                                        </span>
                                        <h3>{category.category_name}</h3>
                                    </div>

                                    <div className="admin-category-actions">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(category)}
                                            className="admin-category-edit-button"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(category)}
                                            className="admin-category-delete-button"
                                        >
                                            Delete
                                        </button>
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

export default AdminCategoriesPage;
