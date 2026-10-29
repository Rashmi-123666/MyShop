const db=require("../config/db");

async function getCartItem(user_id,product_id)
{
    const [rows]=await db.query(
        "select * from cart where user_id=? AND product_id=?",
        [user_id,product_id]
    );
    return rows;
}

async function updateQuantity(
    user_id,
    product_id,
    quantity
)
{
    await db.query(
        "update cart set quantity=quantity + ? where user_id=? AND product_id=?",
        [quantity,user_id,product_id]
    );
}

async function addCartItem(
    user_id,
    product_id,
    quantity
)
{
    await db.query(
        "insert into cart(user_id,product_id,quantity) values(?,?,?)",
        [user_id,product_id,quantity]
    );
}


async function getCart(user_id)
{
    const [rows]=await db.query(
        "select c.cart_id,p.product_id,p.name,p.price,p.image_url,c.quantity from products p INNER JOIN cart c on p.product_id=c.product_id where c.user_id=?",[user_id]
    );
    return rows;
}

async function updateCart(
    user_id,
    cart_id,
    quantity
)
{
    const [result]= await db.query(
        "update cart set quantity=? where user_id=? AND cart_id=?",[quantity,user_id,cart_id]
    );
    return result;
}

async function deleteCart(
    user_id,
    cart_id
)
{
    const [result]=await db.query(
        "delete from cart where user_id=? AND cart_id=?",[user_id,cart_id]
    );
    return result;
}

async function clearCart(user_id)
{
    const [result]=await db.query(
        "delete from cart where user_id=?",[user_id]
    );
    return result;
}
module.exports={
    getCartItem,
    updateQuantity,
    addCartItem,
    getCart,
    updateCart,
    deleteCart,
    clearCart
};