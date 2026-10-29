const jwt = require("jsonwebtoken");

function authenticate(req, res, next)
{
    const authorization = req.headers.authorization;

    if(!authorization)
    {
        return res.status(401).json({
            message:"access denied"
        });
    }

    const token = authorization.split(" ")[1];

    try
    {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();
    }
    catch(err)
    {
        return res.status(401).json({
            message:"invalid or expired token"
        });
    }
}

module.exports = authenticate;