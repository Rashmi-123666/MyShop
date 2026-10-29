const express=require("express");
const router=express.Router();

const categoryController=require("../controllers/categoryController");
const authenticate=require("../middleware/authenticate");
const authorizeAdmin=require("../middleware/authorizeAdmin");
const validateCategory=require("../middleware/validateCategory");
const validateId=require("../middleware/validateId");

router.get("/",categoryController.getAllCategories);
router.get("/:id",validateId,categoryController.getCategoryById);
router.get("/:id/products",validateId,categoryController.getProductsByCategory);
router.post("/",authenticate,authorizeAdmin,validateCategory,categoryController.addCategory);
router.put("/:id",validateId,authenticate,authorizeAdmin,validateCategory,categoryController.updateCategory);
router.delete("/:id",validateId,authenticate,authorizeAdmin,categoryController.deleteCategory);
module.exports=router;