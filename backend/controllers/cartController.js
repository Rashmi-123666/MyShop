const cartModel=require("../models/cartModel");
async function addToCart(req,res)
{
    try
    {
        console.log("ADD TO CART CALLED");

        const user_id=req.user.user_id;
        const {product_id,quantity}=req.body;

        console.log("USER ID:", user_id);
        console.log("PRODUCT ID:", product_id);
        console.log("QUANTITY:", quantity);

        if(quantity <= 0)
        {
            return res.status(400).json({
                message:"Quantity must be greater than 0"
            });
        }

        const rows=await cartModel.getCartItem(
            user_id,
            product_id
        );

        console.log("EXISTING CART ITEM:", rows);

        if(rows.length>0)
        {
            await cartModel.updateQuantity(
                user_id,
                product_id,
                quantity
            );
        }
        else
        {
            await cartModel.addCartItem(
                user_id,
                product_id,
                quantity
            );
        }

        console.log("ADD TO CART SUCCESS");

        return res.status(200).json({
            message:"product added to cart"
        });
    }
    catch(err)
    {
        console.log("ADD TO CART ERROR:", err);

        return res.status(500).json({
            message:"database error"
        });
    }
}
async function getCart(req,res)
{
    try{
        const user_id=req.user.user_id;
        const rows=await cartModel.getCart(user_id);
        res.json(rows);
    }
    catch(err)
    {
        return res.status(500).json({
            message:"database error"
        });
    }
}

async function updateCart(req,res)
{
    try{
        const user_id=req.user.user_id;
        const cart_id=req.params.id;
        const {quantity}=req.body;
        if(quantity<=0)
        {
            return res.status(400).json({
                message:"quantity must be greater than 0"
            });
        }

        const result=await cartModel.updateCart(user_id,cart_id,quantity);

        if(result.affectedRows===0)
        {
            return res.status(404).json({
                message:"cart item not found"
            });
        }

        return res.status(200).json({
            message:"cart item updated successfully"
        });
        
    }
    catch(err)
    {
        return res.status(500).json({
            message:"database error"
        });
    }
}

async function deleteCart(req,res)
{
    try{
        const user_id=req.user.user_id;
        const cart_id=req.params.id;
        const result=await cartModel.deleteCart(user_id,cart_id);
        if(result.affectedRows===0)
        {
            return res.status(404).json({
                message:"cart item not found"
            });
        }
        return res.status(200).json({
            message:"cart item deleted successfully"
        });
    }
    catch(err)
    {
        return res.status(500).json({
            message:"database error"
        });
    }
}
async function clearCart(req,res)
{
    try
    {
        const user_id=req.user.user_id;

        console.log("CLEAR CART CALLED");
        console.log("USER ID:", user_id);

        const result=await cartModel.clearCart(user_id);

        console.log("DELETE RESULT:", result);

        return res.status(200).json({
            message:"cart cleared successfully"
        });
    }
    catch(err)
    {
        console.log("CLEAR CART ERROR:", err);

        return res.status(500).json({
            message:"database error"
        });
    }
}
module.exports={
    addToCart,
    getCart,
    updateCart,
    deleteCart,
    clearCart
};