const bcrypt=require("bcrypt");
const userModel=require("../models/userModel");
const jwt=require("jsonwebtoken");

async function register(req,res)
{
    try{
            const {name,email,password}=req.body;
            const existingUser=await userModel.getUserByEmail(email);
            if(existingUser.length>0)
            {
                return res.status(409).json({
                    message:"Email already registered"
                });
            }
            const role="user";
            const hashedPassword= await bcrypt.hash(password,10);
            console.log("ROLE:", role);
            await userModel.register(
                name,
                email,
                hashedPassword,
                role
            );
            res.status(201).json({
                message:"User registered successfully"
            });
    }
    catch(err){
            console.log(err);
            res.status(500).json({
                message:"database server error"
            });
    }
}


async function login(req,res)
{
    try{
            const {email,password}=req.body;
            const user=await userModel.getUserByEmail(email);
            
            if(user.length===0)
            {
                return res.status(401).json({
                    message:"Invalid email or password"
                });
            }

            const match=await bcrypt.compare(password,user[0].password);
            if(!match)
            {
                return res.status(401).json({
                    message:"Invalid email or password"
                });
            }

            const token=jwt.sign(
                {
                user_id:user[0].user_id,
                role:user[0].role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn:"1h"
                }
            );

            res.json({
                message:"login successfull",
                token:token
            });
            
            
    }
    catch(err)
    {
        res.status(500).json({
            message:"Daatabase error"
        });
    }
}
module.exports={
    register,
    login
};