function Cart(props)
{
    return(
        <>
            <h2>Cart</h2>
                {props.cart.map(item=>(
                   <div  key={item.product.product_id}>
                        <h3>{item.product.name}</h3>
                        <p>₹{item.product.price}</p>
                        <p>Quantity:{item.quantity}</p>
                        
                        <div><button onClick={()=>props.increaseQuantity(item.product)}>+</button>
                            <button onClick={()=>props.decreaseQuantity(item.product)}>-</button>
                            <button onClick={()=>props.removeFromCart(item.product.product_id)}>remove</button>
                        </div>
                   </div>
                    
                ))

                }
                <h2>Total Price: ₹{props.totalPrice}</h2>
        </>
    )
}

export default Cart;