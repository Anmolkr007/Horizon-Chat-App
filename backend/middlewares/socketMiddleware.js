import jwt from 'jsonwebtoken';
import { sql } from '../config/DB.js';

const socketMiddleware = async (socket, next) => {
    try{
        const token = socket.handshake?.auth.token;
        if(!token){
            return next(new Error("Authentication error: Token not provided"));
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await sql `select id,name,email,bio from users where id = ${decoded.id}`;
        if(!user) {
            console.log("User not found in socket middleware");
            return next(new Error("Authentication error: User not found"));//this will trigger the 'connect_error' event on the client side
        }
        socket.user = user[0]; // Attach the user info to the socket object for later use
        console.log("Socket authenticated user: ", socket.user);
        next();
    }
    catch (error) {
        return next(new Error("Authentication error: Invalid token"));
    }
}

export default socketMiddleware;