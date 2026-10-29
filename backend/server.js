require("dotenv").config();
const express=require("express");
const cors=require("cors");
const app=express();
app.use(cors());

app.use(express.json());
const productRoutes = require("./routes/productRoutes");
const userRoutes=require("./routes/userRoutes");
const cartRoutes=require("./routes/cartRoutes");
const orderRoutes=require("./routes/orderRoutes");
const adminRoutes=require("./routes/adminRoutes");
const categoryRoutes=require("./routes/categoryRoutes");

app.use("/products",productRoutes);
app.use("/users",userRoutes);
app.use("/cart",cartRoutes);
app.use("/orders",orderRoutes);
app.use("/admin",adminRoutes);
app.use("/categories",categoryRoutes);

app.listen(5000,()=>{
    console.log("server strated on port 5000");
});