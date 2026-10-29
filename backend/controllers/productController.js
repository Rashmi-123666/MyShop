const productModel=require("../models/productModel");

async function getProducts(req,res)
{
    try
    {
        const search = req.query.search || "";
        const category = req.query.category;
        const sort = req.query.sort;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 100;

        const offset = (page - 1) * limit;
        const minPrice=req.query.minPrice;
        const maxPrice=req.query.maxPrice;
        const categoryName=req.query.categoryName;
        const products = await productModel.getAllProducts(
            search,
            category,
            categoryName,
            minPrice,
            maxPrice,
            sort,
            limit,
            offset
        );
        
        const total=await productModel.getProductCount();
        const totalPages=Math.ceil(total/limit);
        res.json({
            page,
            limit,
            total,
            totalPages,
            products
        });
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({
            message:"database error"
        });
    }
}

async function getProductById(req,res)
{
    try{
        const product_id=req.params.id;
        const product=await productModel.getProductById(product_id);
        if(!product)
        {
            return res.status(404).json({
                message:"product not found"
            });
        }
        return res.json(product)
    }
    catch(err)
    {
        res.status(500).json({
            message:"database error"
        });
    }
}

async function addProduct(req, res) {
    try {
        const { name, price, stock, category_id, image_url } = req.body;

        const result = await productModel.addProduct(
            name.trim(),
            Number(price),
            Number(stock),
            Number(category_id),
            image_url?.trim() || null
        );

        return res.status(201).json({
            message: "Product added successfully",
            product_id: result.insertId
        });
    } catch (err) {
        console.error("ADD PRODUCT ERROR:", err);

        return res.status(500).json({
            message: "Unable to add product"
        });
    }
}

async function updateProduct(req, res) {
    try {
        const { name, price, stock, category_id, image_url } = req.body;
        const product_id = req.params.id;

        const result = await productModel.updateProduct(
            product_id,
            name.trim(),
            Number(price),
            Number(stock),
            Number(category_id),
            image_url?.trim() || null
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Product not found or no changes were made"
            });
        }

        return res.json({
            message: "Product updated successfully"
        });
    } catch (err) {
        console.error("UPDATE PRODUCT ERROR:", err);

        return res.status(500).json({
            message: "Unable to update product"
        });
    }
}


async function deleteProduct(req,res)
{
    try{
        const product_id=req.params.id;
        const result=await productModel.deleteProduct(product_id);
        if(result.affectedRows===0)
        {
            return res.status(404).json({
                message:"product not found"
            });
        }
        res.status(200).json({
            message:"product deleted successfully"
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
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};
