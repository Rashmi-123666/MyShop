function validateCategory(req,res,next)
{
    const {category_name}=req.body;
    if(!category_name || category_name.trim()==="")
    {
         return res.status(400).json({
            message:"category name is required"
        });
    }
    next();
}

module.exports=validateCategory;