import { useState,useEffect } from "react";
import ProductCard from "./components/ProductCard";
import Cart from "./components/Cart";

function Products(props)
{
    const [products,setProducts]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState("");
    

    async function getProducts()
    {
        try{
            const response=await fetch("http://localhost:5000/products");
            if(!response.ok)
            {
                throw new Error("failed to fetch products");
            }
            const data=await response.json();
            setProducts(data.products)
       
        }
        catch(err)
        {
            setError("Failed to fetch products");
        }
        finally{
            setLoading(false);
        }
    }

     useEffect(()=>{
          getProducts()  
        },[]);
    
    if(error)
    {
        return <h2>{error}</h2>;
    }
    function addToCart(product)
    {
        const existingProduct=props.cart.find(
            item=> item.product.product_id===product.product_id
        );

        if(existingProduct)
        {
            alert("product alraedy exist check in cart")
        }
        else{
            props.setCart([
                ...props.cart,
                {
                    product:product,
                    quantity:1
                }
            ]);
        }

    }

    function increaseQuantity(product)
    {
        const updatedCart=props.cart.map(
            item=>item.product.product_id===product.product_id?
            {
                ...item,
                quantity:item.quantity+1
            }:item
        );
        props.setCart(updatedCart);
    }

    function decreaseQuantity(product)
    {
        const updatedCart=props.cart.map(
            item=>item.product.product_id===product.product_id?
            {
                ...item,
                quantity:item.quantity-1
            }:item
        ).
        filter(item=>item.quantity>0);
        props.setCart(updatedCart);
    }

    function removeFromCart(productId)
    {
        const updatedCart=props.cart.filter(
            item=>item.product.product_id !==productId
        );
        props.setCart(updatedCart);
    }
    if(loading)
    {
        return <h2>loading products</h2>
    }
    

    const totalPrice = props.cart.reduce(
    (total, item) => total + item.product.price *  item.quantity ,
    0
    );
    return(
            <>
            
            <h2>Products</h2>
                {products.map(product=>(
                    <ProductCard
                        key={product.product_id}
                        product={product}
                        addToCart={addToCart}
                    />
                ))}
            <Cart
                cart={props.cart}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
                removeFromCart={removeFromCart}
                totalPrice={totalPrice}
            />
            
            </>
        )
}

export default Products;