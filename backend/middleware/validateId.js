function validateId(req,res,next)
{
    const id=Number(req.params.id);
    if(isNaN(id) || id<1)
    {
        return res.status(400).json({
            message:"Inavlid Id"
        });
    }
    next();
}

module.exports=validateId;