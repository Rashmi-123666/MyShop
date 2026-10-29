const orderModel=require("../models/orderModel");
const db=require("../config/db");


async function placeOrder(req,res)
{
    let connection;
    try{
        const user_id=req.user.user_id;
        connection=await db.getConnection();
        await connection.beginTransaction();
        const items=await orderModel.getCartItems(connection,user_id);

       

        if(items.length===0)
        {
            await connection.rollback();
            return res.status(400).json({
                message:"cart is empty"
            });
        }

        const productIds=items.map(
            item => item.product_id
        ); 

        const products=await orderModel.getProductsByIds(connection,productIds);
        
        for(const item of items)
        {
            const product=products.find(
                p => p.product_id===item.product_id
            );

            if(!product)
            {
                await connection.rollback();
                return res.status(404).json({
                    message:"product not found"
                });
            }

            if(product.stock < item.quantity)
            {
                await connection.rollback();
                return res.status(400).json({
                    message:"product is out of stock"
                });
            }
        }

        const order_id=await orderModel.createOrder(connection,user_id);

         for(const item of items)
        {
            const product=products.find(
                p => p.product_id===item.product_id
            );

            await orderModel.addOrderItem(
                connection,
                order_id,
                item.product_id,
                item.quantity,
                product.price
            );

            await orderModel.reduceStock(
                connection,
                item.product_id,
                item.quantity
            );
        }

        await orderModel.clearCart(
            connection,
            user_id
        );

        await connection.commit();

        return res.status(201).json({
            message: "Order placed successfully",
            order_id: order_id
        });
    }
    catch(err)
    {
        if(connection)
        {
            await connection.rollback();
        }
        return res.status(500).json({
            message:"database error"
        });
    }
    finally{
        if(connection)
        {
            connection.release();
        }
    }
}


async function getOrders(req,res)
{
    try{
        const user_id=req.user.user_id;
        const rows=await orderModel.getOrders(user_id);

        res.json(rows);
    }
    catch(err)
    {
        return res.status(500).json({
            message:"database error"
        });
    }
}

async function getOrderDetails(req,res)
{
    try{
        const order_id=req.params.id;
        const user_id=req.user.user_id;

        const rows=await orderModel.getOrderDetails(order_id,user_id);
        if(rows.length===0)
        {
            return res.status(404).json({
                message:"order details not found"
            });
        }

        res.json(rows);
    }
    catch(err)
    {
        return res.status(500).json({
            message:"database error"
        });
    }
}



module.exports={
    placeOrder,
    getOrders,
    getOrderDetails
};