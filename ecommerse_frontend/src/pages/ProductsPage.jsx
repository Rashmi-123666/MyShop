
import { useContext,useState,useEffect } from "react";
import { CartContext } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import { AuthContext } from "../context/AuthContext";
import apiFetch from "../utils/api";
import { useNavigate , useSearchParams} from "react-router-dom";
import "./ProductsPage.css";

function ProductsPage()
{
    const {setCart}=useContext(CartContext);
    const [products,setProducts]=useState([]);
    const [error, setError]=useState("");
    const [loading, setLoading]=useState(true);
    const {logout}=useContext(AuthContext);
    const navigate=useNavigate();
    const [searchParams]=useSearchParams();
    const categoryId = searchParams.get("category");
    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState([]);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    async function getProducts()
{
    try {
        setLoading(true);
        setError("");

        let url = "http://localhost:5000/products";

        if (categoryId) {
            url = `http://localhost:5000/categories/${categoryId}/products`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        // Category API returns an array directly.
        // Products API returns an object containing products.
        if (categoryId) {
            setProducts(data);
        } else {
            setProducts(data.products);
        }
    }
    catch(err) {
        setError(err.message);
    }
    finally {
        setLoading(false);
    }
}

    useEffect(()=>{
        getProducts()
    },[categoryId]);

async function getCategories() {
    try {
        const response = await fetch("http://localhost:5000/categories");

        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(data);
    }
    catch (err) {
        console.log("CATEGORY ERROR:", err);
    }
}

useEffect(() => {
    getCategories();
}, []);
    async function addToCart(product)
{
    try
    {

        // Step 1: Add product to backend cart
        const response = await apiFetch(
            "http://localhost:5000/cart",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    product_id: product.product_id,
                    quantity: 1
                })
            },
            ()=>{
                logout();
                navigate("/login");
            }
        );

        const data = await response.json();

        

        if(!response.ok)
        {
            alert(data.message ||"Failed to add product to cart");
            return;
        }

        // Step 2: Get updated cart from backend
        const cartResponse = await apiFetch(
            "http://localhost:5000/cart",
            {},
            ()=>{
                logout();
                navigate("/login");
            }
        );

        const cartData = await cartResponse.json();

        

        if(!cartResponse.ok)
        {
            alert("Product added but failed to load cart");
            return;
        }

        // Step 3: Convert backend data
        // into the format used by CartContext
        const formattedCart = cartData.map(item => ({
            cart_id: item.cart_id,

            product: {
                product_id: item.product_id,
                name: item.name,
                price: item.price
            },

            quantity: item.quantity
        }));

        // Step 4: Update React cart
        setCart(formattedCart);

        alert("Product added to cart");
    }
    catch(err)
    {
        console.log("ADD TO CART ERROR:", err);
        alert("Something went wrong");
    }
}
        if(loading)
        {
            return <h2>Loading products...</h2>;
        }

        if(error)
        {
            return <h2>{error}</h2>;
        }

const filteredProducts = products.filter(product => {
    const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

    const price = Number(product.price);

    const matchesMinPrice =
        minPrice === "" || price >= Number(minPrice);

    const matchesMaxPrice =
        maxPrice === "" || price <= Number(maxPrice);

    return matchesSearch && matchesMinPrice && matchesMaxPrice;
});

const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "low-high") {
        return Number(a.price) - Number(b.price);
    }

    if (sortOrder === "high-low") {
        return Number(b.price) - Number(a.price);
    }

    return 0;
});
           
return (
    <main className="products-page">
        <section className="products-heading">
            <div>
                <p className="products-eyebrow">EXPLORE OUR COLLECTION</p>
                <h1>{categoryId ? "Category Products" : "Our Products"}</h1>
                <p>Find something you'll love.</p>
            </div>

            <span className="products-count">
                {filteredProducts.length} products
            </span>
        </section>
<section className="products-toolbar">
    <div className="products-search">
        <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
    </div>

    <div className="products-filter">
        <label htmlFor="category-filter">Category:</label>

        <select
            id="category-filter"
            value={categoryId || ""}
            onChange={(e) => {
                const selectedId = e.target.value;

                navigate(
                    selectedId
                        ? `/products?category=${selectedId}`
                        : "/products"
                );
            }}
        >
            <option value="">All Categories</option>

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
    <div className="price-filter">
    <input
        type="number"
        placeholder="Min ₹"
        value={minPrice}
        min="0"
        onChange={(e) => setMinPrice(e.target.value)}
    />

    <input
        type="number"
        placeholder="Max ₹"
        value={maxPrice}
        min="0"
        onChange={(e) => setMaxPrice(e.target.value)}
    />

    <button
        onClick={() => {
            setMinPrice("");
            setMaxPrice("");
        }}
    >
        Clear Price
    </button>
    
</div>
<div className="sort-filter">
    <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
    >
        <option value="">Default Sorting</option>
        <option value="low-high">Price: Low to High</option>
        <option value="high-low">Price: High to Low</option>
    </select>
</div>

</section>
        <section className="products-grid">
            {filteredProducts.length === 0 && (
                <p>No products found.</p>
            )}
            {sortedProducts.map(product => (
                <ProductCard
                    key={product.product_id}
                    product={product}
                    addToCart={addToCart}
                />
            ))}
        </section>
    </main>
);
    }

export default ProductsPage;