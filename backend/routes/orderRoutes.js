const express=require("express");
const router=express.Router();

const authenticate=require("../middleware/authenticate");
const authorizeAdmin=require("../middleware/authorizeAdmin");
const validateId=require("../middleware/validateId");
const orderController=require("../controllers/orderController");

router.post("/",authenticate,orderController.placeOrder);
router.get("/",authenticate,orderController.getOrders);
router.get("/:id",authenticate,validateId,orderController.getOrderDetails);

module.exports=router;