
import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product, addToCart }) {
    const isOutOfStock = product.stock === 0;
    console.log(product.name, product.image_url);
    return (
        <article className="product-card">
            <div className="product-image-placeholder">
                {product.image_url ? (
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="product-image"
                />
                ) : (
                <span aria-hidden="true">🛍️</span>
                )}

                <span
                        className={`stock-badge ${
                        isOutOfStock ? "out-of-stock" : "in-stock"
                    }`}
                >
                {isOutOfStock ? "Out of stock" : "In stock"}
                </span>
            </div>
        


            <div className="product-card-content">
                <p className="product-category">
                    {product.category_name}
                </p>

                <h3 className="product-name">
                    {product.name}
                </h3>

                <p className="product-price">
                    ₹{Number(product.price).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
                </p>

                {!isOutOfStock && (
                    <p className="product-stock">
                        {product.stock} available
                    </p>
                )}

                <div className="product-card-actions">
                    {!isOutOfStock && (
                        <button
                            className="add-cart-button"
                            onClick={() => addToCart(product)}
                        >
                            Add to Cart
                        </button>
                    )}

                    <Link
                        className="details-button"
                        to={`/products/${product.product_id}`}
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default ProductCard;