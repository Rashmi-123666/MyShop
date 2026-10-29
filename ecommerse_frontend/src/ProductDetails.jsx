import { useNavigate, useParams } from "react-router-dom";
import { useContext,useState,useEffect } from "react";
import { CartContext } from "./context/CartContext";
import apiFetch from "./utils/api";
import { AuthContext } from "./context/AuthContext";
import "./ProductDetails.css";
function ProductDetails()
{
    const {id}=useParams();
    const {setCart}=useContext(CartContext);
    const [product,setProduct]=useState(null);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState("");
    const {logout}=useContext(AuthContext);
    const navigate=useNavigate();
    async  function getProduct()
    {
        try{
            const response=await fetch(
                "http://localhost:5000/products"
            );

            if(!response.ok)
            {
                throw new Error("failed to fetch products");
            }

            const data=await response.json();

            const foundProduct=data.products.find(
                product=>product.product_id===Number(id)
            );

            if(!foundProduct)
            {
                throw new Error("product not found");
            }
            setProduct(foundProduct);
        }
        catch(err)
        {
            setError(err.message);
        }
        finally
        {
            setLoading(false);
        }
    }

    useEffect(()=>{
        getProduct()
    },[id]);

    async function addToCart()
{
    try
    {
        

        const response = await apiFetch(
            "http://localhost:5000/cart",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
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
            alert(data.message || "Failed to add product to cart");
            return;
        }

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
            alert("Product added but cart could not be loaded");
            return;
        }

        const formattedCart = cartData.map(item => ({
            cart_id: item.cart_id,
            product: {
                product_id: item.product_id,
                name: item.name,
                price: item.price
            },
            quantity: item.quantity
        }));

        setCart(formattedCart);

        alert("Product added to cart");
    }
    catch(err)
    {
        console.log("ADD TO CART ERROR:", err);
        alert("Something went wrong. Please try again.");
    }
}
    if(loading)
    {
        return <h2>loading products</h2>
    }
    if(error)
    {
        return <h2>{error}</h2>
    }

return (
    <div className="product-details-page">
        <div className="product-details-card">

            <div className="product-details-image">
                <img
                    src={product.image_url}
                    alt={product.name}
                    onError={(e) => {
                        e.currentTarget.style.display = "none";
                    }}
                />
            </div>

            <div className="product-details-info">
                <p className="product-details-category">
                    {product.category_name}
                </p>

                <h1>{product.name}</h1>

                <p className="product-details-price">
                    ₹{Number(product.price).toLocaleString("en-IN", {
                        minimumFractionDigits: 2
                    })}
                </p>

                <p className="product-details-stock">
                    {product.stock > 0
                        ? `${product.stock} available`
                        : "Out of stock"}
                </p>

                {product.stock > 0 ? (
                    <button
                        className="product-details-button"
                        onClick={addToCart}
                    >
                        Add to Cart
                    </button>
                ) : (
                    <button disabled>
                        Out of Stock
                    </button>
                )}
            </div>

        </div>
    </div>
);
}

export default ProductDetails;