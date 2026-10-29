const express=require("express");
const router=express.Router();

const cartController=require("../controllers/cartController");
const authenticate=require("../middleware/authenticate");
const validateId=require("../middleware/validateId");
router.post("/",authenticate,cartController.addToCart);
router.get("/",authenticate,cartController.getCart);
router.put("/:id",authenticate,validateId,cartController.updateCart);
router.delete("/:id",authenticate,validateId,cartController.deleteCart);
router.delete("/",authenticate,cartController.clearCart);

module.exports=router;