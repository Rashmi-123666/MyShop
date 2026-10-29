
const db = require("../config/db");

async function getAllProducts(
    search,
    category,
    categoryName,
    minPrice,
    maxPrice,
    sort,
    limit,
    offset
) {
    let sql = `
        SELECT
            p.product_id,
            p.name,
            p.price,
            p.stock,
            p.category_id,
            p.image_url,
            c.category_name
        FROM products p
        INNER JOIN categories c
            ON p.category_id = c.category_id
        WHERE 1 = 1
    `;

    const values = [];

    if (search) {
        sql += " AND p.name LIKE ?";
        values.push(`%${search}%`);
    }

    if (category) {
        sql += " AND p.category_id = ?";
        values.push(category);
    }

    if (categoryName) {
        sql += " AND c.category_name LIKE ?";
        values.push(`%${categoryName}%`);
    }

    if (minPrice !== undefined && minPrice !== "") {
        sql += " AND p.price >= ?";
        values.push(minPrice);
    }

    if (maxPrice !== undefined && maxPrice !== "") {
        sql += " AND p.price <= ?";
        values.push(maxPrice);
    }

    let orderBy = "p.name ASC";

    if (sort === "price_desc") {
        orderBy = "p.price DESC";
    } else if (sort === "price_asc") {
        orderBy = "p.price ASC";
    }

    sql += ` ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
    values.push(limit, offset);

    const [rows] = await db.query(sql, values);
    return rows;
}

async function getProductById(product_id) {
    const [rows] = await db.query(
        `SELECT
            p.product_id,
            p.name,
            p.price,
            p.stock,
            p.category_id,
            p.image_url,
            c.category_name
        FROM products p
        INNER JOIN categories c
            ON p.category_id = c.category_id
        WHERE p.product_id = ?`,
        [product_id]
    );

    return rows[0];
}

async function getProductCount() {
    const [rows] = await db.query(
        "SELECT COUNT(*) AS total FROM products"
    );

    return rows[0].total;
}

async function addProduct(
    name,
    price,
    stock,
    category_id,
    image_url
) {
    const [result] = await db.query(
        `INSERT INTO products
            (name, price, stock, category_id, image_url)
         VALUES (?, ?, ?, ?, ?)`,
        [name, price, stock, category_id, image_url || null]
    );

    return result;
}

async function updateProduct(
    product_id,
    name,
    price,
    stock,
    category_id,
    image_url
) {
    const [result] = await db.query(
        `UPDATE products
         SET name = ?,
             price = ?,
             stock = ?,
             category_id = ?,
             image_url = ?
         WHERE product_id = ?`,
        [name, price, stock, category_id, image_url || null, product_id]
    );

    return result;
}

async function deleteProduct(product_id) {
    const [result] = await db.query(
        "DELETE FROM products WHERE product_id = ?",
        [product_id]
    );

    return result;
}

module.exports = {
    getAllProducts,
    getProductById,
    getProductCount,
    addProduct,
    updateProduct,
    deleteProduct
};
