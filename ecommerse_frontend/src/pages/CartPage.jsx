import { useContext,useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

import {Link, useNavigate} from "react-router-dom";
import apiFetch from "../utils/api";
import "./CartPage.css";

function CartPage()
{
    const {cart,setCart}=useContext(CartContext);
    const {logout}=useContext(AuthContext);
    const navigate=useNavigate();

    async function getCart()
    {
        
        const response=await apiFetch(
            "http://localhost:5000/cart",
            {},
            ()=>{
                logout();
                setCart([]);
                navigate("/login");

            }
        );

        if(!response.ok)
        {
            console.log("failed to fetch cart");
            return;
        }
        const data=await response.json();
        const formattedData=data.map(item=>({
            cart_id:item.cart_id,
            product:{
                product_id:item.product_id,
                name:item.name,
                price:item.price,
                image_url: item.image_url
            },
            quantity:item.quantity
        }));
        setCart(formattedData);
    }

    useEffect(()=>{
        getCart()
    },[]);

    async function updateCartBackend(cart_id,quantity)
    {
        
        const response=await apiFetch(
            `http://localhost:5000/cart/${cart_id}`,
            {
                method: "PUT",
                headers:{
                    "Content-Type":"application/json",
                },
                body: JSON.stringify({
                    quantity:quantity
                })
            },
            ()=>{
                logout();
                setCart([]);
                navigate("/login");
            }
        );

        if(!response.ok)
        {
            console.log("failed to update cart");
            return false;
        }
        return true;
    }
    async function increaseQuantity(item)
    {
        const newQuantity=item.quantity+1;
        const success=await updateCartBackend(
            item.cart_id,
            newQuantity
        );
        if(!success)
        {
            return;
        }
        const updatedCart = cart.map(
            cartItem =>
                cartItem.cart_id === item.cart_id
                ?
                {
                    ...cartItem,
                    quantity: newQuantity
                }
                :
                cartItem
        );

        setCart(updatedCart);
    }

    async function decreaseQuantity(item)
    {
        if(item.quantity>1)
        {
            const newQuantity=item.quantity-1;
             const success=await updateCartBackend(
            item.cart_id,
            newQuantity
        );
        if(!success)
        {
            return;
        }
            const updatedCart = cart
            .map(
                cartItem =>
                    cartItem.cart_id === item.cart_id
                    ?
                    {
                        ...cartItem,
                        quantity: newQuantity
                    }
                    :
                    cartItem
            );
            

        setCart(updatedCart);
        }
        else{
             await removeFromCart(item)
        }
    }

    async function removeFromCart(item)
    {
        
        const response=await apiFetch(
            `http://localhost:5000/cart/${item.cart_id}`,
            {
                method :"DELETE"
                
            },
            ()=>{
                logout();
                setCart([]);
                navigate("/login");
            }
        );

        if(!response.ok)
        {
            console.log("failed to remove cart item");
            return;
        }
        
        const updatedCart = cart.filter(
            cartItem => cartItem.cart_id !== item.cart_id
        );

        setCart(updatedCart);
    }

    async function clearCart()
    {
       
        const response=await apiFetch(
            "http://localhost:5000/cart",{
                method:"DELETE"
            },
            ()=>{
                logout();
                setCart([]);
                navigate("/login");
            }
        );
        if(!response.ok)
        {
            console.log("failed to clear cart");
            return;
        }
        setCart([]);
    }
    const totalPrice = cart.reduce(
        (total, item) =>
            total + item.product.price * item.quantity,
        0
    );

    
return (
    <div className="cart-page">
        <h1 className="cart-title">Shopping Cart</h1>

        {cart.length === 0 ? (
            <div className="empty-cart">
                <div className="empty-cart-icon">🛒</div>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added anything yet.</p>
                <Link to="/products" className="continue-shopping">
                    Explore Products
                </Link>
            </div>
        ) : (
            <div className="cart-layout">
                <div className="cart-items">
                    {cart.map(item => (
                        <div className="cart-item" key={item.product.product_id}>
                            <div className="cart-product-icon">
                            <img
                                src={item.product.image_url}
                                alt={item.product.name}
                                onError={e => {
                                e.currentTarget.style.display = "none";
                                }}
                            />
                            </div>
                            <div className="cart-product-info">
                                <h2>{item.product.name}</h2>
                                <p className="cart-product-price">
                                    ₹{Number(item.product.price).toLocaleString("en-IN", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </p>

                                <div className="quantity-controls">
                                    <button
                                        className="quantity-button"
                                        onClick={() => decreaseQuantity(item)}
                                        aria-label={`Decrease quantity of ${item.product.name}`}
                                    >
                                        −
                                    </button>

                                    <span className="quantity-value">
                                        {item.quantity}
                                    </span>

                                    <button
                                        className="quantity-button"
                                        onClick={() => increaseQuantity(item)}
                                        aria-label={`Increase quantity of ${item.product.name}`}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="cart-item-right">
                                <p className="cart-subtotal">
                                    ₹{(Number(item.product.price) * item.quantity).toLocaleString("en-IN", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </p>

                                <button
                                    className="remove-button"
                                    onClick={() => removeFromCart(item)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <aside className="cart-summary">
                    <h2>Order Summary</h2>

                    <div className="summary-row">
                        <span>Total items</span>
                        <span>{cart.reduce((total, item) => total + item.quantity, 0)}</span>
                    </div>

                    <div className="summary-total">
                        <span>Total price</span>
                        <span>
                            ₹{totalPrice.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </span>
                    </div>

                    <Link to="/checkout" className="checkout-button">
                        Proceed to Checkout
                    </Link>

                    <Link to="/products" className="continue-shopping-link">
                        Continue Shopping
                    </Link>

                    <button className="clear-cart-button" onClick={clearCart}>
                        Clear Cart
                    </button>
                </aside>
            </div>
        )}
    </div>
);
}

export default CartPage;