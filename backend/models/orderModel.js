
const db=require("../config/db");


async function getCartItems(
    connection,
    user_id
)
{
    const [items]=await connection.query(
        "select product_id,quantity from cart where user_id=?",[user_id]
    );
    return items;
}
  async function getProductsByIds(
    connection,
    productIds
  )
  {
        const [rows]=await connection.query(
            "select product_id,price,stock from products where product_id in(?)",[productIds]
        );
        return rows;
  }

  async function createOrder(
    connection,
    user_id
  )
  {
        const [result]=await connection.query(
            "insert into orders(user_id) values(?)",[user_id]
        );
        return result.insertId;
  }

  async function addOrderItem(
    connection,
    order_id,
    product_id,
    quantity,
    price
  )
  {
        await connection.query(
            "insert into order_items(order_id,product_id,quantity,price) values(?,?,?,?)",[order_id,product_id,quantity,price]
        );
  }

  async function reduceStock(
    connection,
    product_id,
    quantity
  )
  {
        await connection.query(
            "update products set stock=stock - ? where product_id=?",[quantity,product_id]
        );
  }

  async function clearCart(
    connection,
    user_id
  )
  {
        await connection.query(
            "delete from cart where user_id=?",[user_id]
        );
  }

  async function getOrders(user_id)
  {
     const [rows]=await db.query(
        "select order_id,orderDate,status from orders where user_id=? order by orderDate desc",[user_id]
     );

     return rows;
  }
async function getOrderDetails(
    order_id,
    user_id
)
{
    const [rows] = await db.query(
        `
        select 
            o.order_id,
            o.orderDate,
            o.status,
            p.product_id,
            p.name,
            p.image_url,
            oi.price,
            oi.quantity

        from orders o

        inner join order_items oi
        on o.order_id = oi.order_id

        inner join products p
        on p.product_id = oi.product_id

        where o.user_id = ?
        AND o.order_id = ?
        `,
        [user_id, order_id]
    );

    return rows;
}

  async function getAllOrders()
  {
        const [rows]=await db.query(
            `
                select u.user_id,u.name,
                o.order_id,o.orderDate,o.status
                from users u
                inner join orders o
                on u.user_id=o.user_id
                order by o.orderDate desc
            `
        );
        return rows;
  }

  async function updateOrderStatus(
    connection,
    order_id,
    status
  )
  {
        const [result]=await connection.query(
            `
                update orders 
                set status=?
                where
                order_id=?
            
            `,[status,order_id]
        );
        return result;
  }

  async function getOrderById(connection,order_id)
{
    const [rows] = await connection.query(
        "select order_id,status from orders where order_id=?",
        [order_id]
    );

    return rows;
}

async function getOrderItems(connection,order_id)
{
    const [rows] = await connection.query(
        "select product_id, quantity from order_items where order_id=?",
        [order_id]
    );

    return rows;
}


async function restoreStock(connection,product_id, quantity)
{
    await connection.query(
        "update products set stock = stock + ? where product_id=?",
        [quantity, product_id]
    );
}  
module.exports={
    getCartItems,
    getProductsByIds,
    createOrder,
    addOrderItem,
    reduceStock,
    clearCart,
    getOrders,
    getOrderDetails,
    getAllOrders,
    updateOrderStatus,
    getOrderById,
    getOrderItems,
    restoreStock
};