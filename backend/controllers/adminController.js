const db=require("../config/db");
const orderModel=require("../models/orderModel");
const adminModel=require("../models/adminModel");

async function getAllOrders(req,res)
{
    try{
        const rows= await orderModel.getAllOrders();
        res.json(rows);
    }
    catch(err)
{
    console.log("GET ALL ORDERS ERROR:", err);

    return res.status(500).json({
        message: "database error"
    });
}
}


async function updateOrderStatus(req, res)
{
    let connection;

    try
    {
        const order_id = req.params.id;
        const { status } = req.body;

        const allowedStatus = [
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ];

        if (!allowedStatus.includes(status))
        {
            return res.status(400).json({
                message: "invalid order status"
            });
        }

        // Get database connection
        connection = await db.getConnection();

        // Start transaction
        await connection.beginTransaction();

        // Get current order
        const order = await orderModel.getOrderById(
            connection,
            order_id
        );

        if (order.length === 0)
        {
            await connection.rollback();

            return res.status(404).json({
                message: "order not found"
            });
        }

        const oldStatus = order[0].status;

        // Restore stock only when changing TO Cancelled
        if (
            oldStatus !== "Cancelled" &&
            status === "Cancelled"
        )
        {
            const items = await orderModel.getOrderItems(
                connection,
                order_id
            );

            for (const item of items)
            {
                await orderModel.restoreStock(
                    connection,
                    item.product_id,
                    item.quantity
                );
            }
        }

        // Update order status
        const result = await orderModel.updateOrderStatus(
            connection,
            order_id,
            status
        );

        if (result.affectedRows === 0)
        {
            await connection.rollback();

            return res.status(404).json({
                message: "order not found"
            });
        }

        // Save all changes
        await connection.commit();

        return res.status(200).json({
            message: "order status updated successfully"
        });
    }
    catch (err)
    {
        console.log("UPDATE ORDER STATUS ERROR:", err);

        if (connection)
        {
            await connection.rollback();
        }

        return res.status(500).json({
            message: "database error"
        });
    }
    finally
    {
        if (connection)
        {
            connection.release();
        }
    }
}
async function getDashboard(req,res)
{
    try{
        const totalUsers=await adminModel.getTotalUsers();
        const totalProducts=await adminModel.getTotalProducts();
        const totalCategories=await adminModel.getTotalCategories();
        const totalOrders=await adminModel.getTotalOrders();
        const totalRevenue=await adminModel.getTotalRevenue();

        res.json({
            totalUsers,
            totalProducts,
            totalCategories,
            totalOrders,
            totalRevenue
        });
    }
    catch(err)
    {
        return res.status(500).json({
            message:"database error"
        });
    }
}
module.exports={
    getAllOrders,
    updateOrderStatus,
    getDashboard
};