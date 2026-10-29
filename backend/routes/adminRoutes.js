const express=require("express");
const router=express.Router();

const authenticate=require("../middleware/authenticate");
const authorizeAdmin=require("../middleware/authorizeAdmin");
const validateId=require("../middleware/validateId");
const adminController=require("../controllers/adminController");

router.get("/orders",authenticate,authorizeAdmin,adminController.getAllOrders);
router.put("/orders/:id",authenticate,authorizeAdmin,validateId,adminController.updateOrderStatus);

router.get("/dashboard",authenticate,authorizeAdmin,adminController.getDashboard);
module.exports=router;