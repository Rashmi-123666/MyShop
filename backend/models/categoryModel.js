const db=require("../config/db");

async function getAllCategories()
{
    const [rows]=await db.query(
        "select * from categories"
    );
    return rows;
}

async function getCategoryById(category_id)
{
    const [rows]=await db.query(
        "select * from categories where category_id=?",[category_id]
    );
    return rows;
}

async function getProductsByCategory(category_id)
{
    const [rows]=await db.query(
        "select product_id,name,price,image_url,stock from products where category_id=?",[category_id]
    );
    return rows;
}
async function addCategory(category_name)
{
    await db.query(
        "insert into categories(category_name) values(?)",[category_name]
    );
}

async function getCategoryByName(category_name)
{
    const [rows]=await db.query(
        "select * from categories where category_name=?",[category_name]
    );
    return rows;
}

async function updateCategory(
    category_id,
    category_name
)
{
    const [result]=await db.query(
        "update categories set category_name=? where category_id=?",[category_name,category_id]
    );
    return result;
}

async function deleteCategory(category_id)
{
    const [result]=await db.query(
        "delete from categories where category_id=?",[category_id]
    );
    return result;
}
module.exports={
    getAllCategories,
    addCategory,
    getCategoryByName,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getProductsByCategory
};