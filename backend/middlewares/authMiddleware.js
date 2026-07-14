import jwt from "jsonwebtoken";
import { sql } from "../config/DB.js";
import { log } from "console";

const authMiddleware =  async(req,res,next)=>{
    try {
        const authHeader = req.headers["authorization"];
        console.log(authHeader);
        
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({message:"access denied, token missing"});
        }
        console.log("in authMIddle1");
        
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await sql `select id,name,email,bio from users where id = ${decoded.id}`;
        if(!user)return res.status(401).json({message:"User not found"});
        req.user = user[0];
        console.log("in middle: ",user);
        next();
    }
    catch (error) {
    if (
        error.name === "TokenExpiredError" ||
        error.name === "JsonWebTokenError"
    ) {
        return res.status(401).json({
            message: "Access token expired",
        });
    }

    return res.status(500).json({
        message: "Internal server error",
    });
}
}
export default authMiddleware;