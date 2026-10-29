const categoryModel=require("../models/categoryModel");

async function getAllCategories(req,res)
{
    try{
        const result=await categoryModel.getAllCategories();
        res.json(result);
    }
    catch(err)
    {
        return res.status(500).json({
            message:"database error"
        });
    }
}

async function getCategoryById(req,res)
{
    try{
        const category_id=req.params.id;
        const rows=await categoryModel.getCategoryById(category_id);
        if(rows.length==0)
        {
            return res.status(404).json({
                message:"category not found"
            })
        }

        return res.json(rows[0]);
    }
    catch(err)
    {
         return res.status(500).json({
                message:"database error"
            });
    }
}
 async function getProductsByCategory(req, res) {
    try {
        const category_id = req.params.id;

        const category = await categoryModel.getCategoryById(category_id);

        if (category.length === 0) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        const rows = await categoryModel.getProductsByCategory(category_id);

        return res.json(rows);
    } catch (err) {
        console.error("GET PRODUCTS BY CATEGORY ERROR:", err);

        return res.status(500).json({
            message: "Database error"
        });
    }
}

async function addCategory(req,res)
{
    try{
        const category_name = req.body.category_name.trim();
        const rows=await categoryModel.getCategoryByName(category_name);
        if(rows.length>0)
        {
            return res.status(409).json({
                message:"category already exist"
            });
        }
        await categoryModel.addCategory(category_name);
        return res.status(201).json({
            message:"category added successfully"
        });
    }
    catch (err) {
    console.error("ADD CATEGORY ERROR:", err);

    return res.status(500).json({
        message: "Database error"
    });
}
}

async function updateCategory(req, res) {
    try {
        const category_id = req.params.id;
        const category_name = req.body.category_name.trim();

        // Check whether category exists
        const category = await categoryModel.getCategoryById(category_id);

        if (category.length === 0) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        // Check duplicate category name
        const rows = await categoryModel.getCategoryByName(category_name);

        if (
            rows.length > 0 &&
            rows[0].category_id != category_id
        ) {
            return res.status(409).json({
                message: "Category already exists"
            });
        }

        await categoryModel.updateCategory(category_id, category_name);

        return res.status(200).json({
            message: "Category updated successfully"
        });

    } catch (err) {
        console.error("UPDATE CATEGORY ERROR:", err);

        return res.status(500).json({
            message: "Database error"
        });
    }
}
async function deleteCategory(req, res) {
    try {
        const category_id = req.params.id;

        const category = await categoryModel.getCategoryById(category_id);

        if (category.length === 0) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        const products = await categoryModel.getProductsByCategory(category_id);

        if (products.length > 0) {
            return res.status(409).json({
                message: "Cannot delete this category because products are using it"
            });
        }

        await categoryModel.deleteCategory(category_id);

        return res.status(200).json({
            message: "Category deleted successfully"
        });
    } catch (err) {
        console.error("DELETE CATEGORY ERROR:", err);

        return res.status(500).json({
            message: "Database error"
        });
    }
}

module.exports={
    getAllCategories,
    addCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getProductsByCategory
};