const db=require("../config/db");

async function getTotalUsers()
{
    const [rows]=await db.query(
        "select count(*) as total from users"
    );

    return rows[0].total;
}

async function getTotalProducts()
{
    const [rows]=await db.query(
        "select count(*) as total from products"
    );

    return rows[0].total;
}

async function getTotalCategories()
{
    const [rows]=await db.query(
        "select count(*) as total from categories"
    );

    return rows[0].total;
}

async function getTotalOrders()
{
    const [rows]=await db.query(
        "select count(*) as total from orders"
    );

    return rows[0].total;
}

async function getTotalRevenue()
{
    const [rows]=await db.query(
        `
            select IFNUll(sum(oi.price * oi.quantity),0) as revenue
            from order_items oi inner join orders o 
            on oi.order_id=o.order_id
            where o.status="Delivered"
        `
    );
    return rows[0].revenue;
}
module.exports={
    getTotalUsers,
    getTotalCategories,
    getTotalProducts,
    getTotalOrders,
    getTotalRevenue
};