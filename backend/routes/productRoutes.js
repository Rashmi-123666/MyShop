
const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const authenticate = require("../middleware/authenticate");
const authorizeAdmin = require("../middleware/authorizeAdmin");
const validateId = require("../middleware/validateId");
const validateProduct = require("../middleware/validateProduct");

// Public routes
router.get("/", productController.getProducts);
router.get("/:id", validateId, productController.getProductById);

// Admin-only routes
router.post(
    "/",
    authenticate,
    authorizeAdmin,
    validateProduct,
    productController.addProduct
);

router.put(
    "/:id",
    validateId,
    authenticate,
    authorizeAdmin,
    validateProduct,
    productController.updateProduct
);

router.delete(
    "/:id",
    validateId,
    authenticate,
    authorizeAdmin,
    productController.deleteProduct
);

module.exports = router;
