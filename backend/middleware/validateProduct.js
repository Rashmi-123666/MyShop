
function validateProduct(req, res, next) {
    const { name, price, stock, category_id, image_url } = req.body;

    // Check required fields
    if (
        !name ||
        price === undefined ||
        stock === undefined ||
        !category_id
    ) {
        return res.status(400).json({
            message: "Name, price, stock, and category are required"
        });
    }

    // Validate product name
    if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
            message: "Product name cannot be empty"
        });
    }

    // Validate price
    if (
        !Number.isFinite(Number(price)) ||
        Number(price) <= 0
    ) {
        return res.status(400).json({
            message: "Price must be a valid number greater than 0"
        });
    }

    // Validate stock
    if (
        !Number.isInteger(Number(stock)) ||
        Number(stock) < 0
    ) {
        return res.status(400).json({
            message: "Stock must be a non-negative whole number"
        });
    }

    // Validate category ID
    if (
        !Number.isInteger(Number(category_id)) ||
        Number(category_id) <= 0
    ) {
        return res.status(400).json({
            message: "Please select a valid category"
        });
    }

    // Validate image URL when provided
    if (image_url !== undefined && image_url !== null && image_url !== "") {
        if (typeof image_url !== "string") {
            return res.status(400).json({
                message: "Image URL must be text"
            });
        }

        try {
            const url = new URL(image_url);

            if (!["http:", "https:"].includes(url.protocol)) {
                throw new Error("Invalid protocol");
            }
        } catch {
            return res.status(400).json({
                message: "Please provide a valid HTTP or HTTPS image URL"
            });
        }
    }

    next();
}

module.exports = validateProduct;
