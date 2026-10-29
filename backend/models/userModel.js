const db=require("../config/db");

async function register(
    name,
    email,
    hashedPassword,
    role
){
    await db.query(
        "insert into users(name,email,password,role) values(?,?,?,?)",
        [name,email,hashedPassword,role]
    );
}

async function getUserByEmail(email)
{
    const [rows]=await db.query(
        "select * from users where email=?",[email]
    );
    return rows;
}
module.exports={
    register,
    getUserByEmail
};