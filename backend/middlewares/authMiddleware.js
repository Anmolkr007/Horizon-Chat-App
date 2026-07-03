import jwt from "jsonwebtoken";
import { sql } from "../config/DB.js";

const authMiddleware =  async(req,res,next)=>{
    try {
        const authHeader = req.headers["authorization"];
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({message:"access denied, token missing"});
        }
        
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await sql `select id,name,email,bio from users where id = ${decoded.id}`;
        if(!user)return res.status(401).json({message:"User not found"});
        req.user = user[0];
        console.log("in middle: ",user);
        next();
    }
    catch (error) {
        console.log("error in auth middleware");
        
        res.status(401).json({message:"Unauthorized"});
    }
}
export default authMiddleware;