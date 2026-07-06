import "dotenv/config";
import express from "express";
import authRoutes from "./routes/authRoute.js";
import messageRoutes from "./routes/messageRoute.js"
import cors from "cors";
import {sql} from "./config/DB.js";
import {createTables} from "./sql/createTables.js"
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { log } from 'console';
import {arcjetProtection} from "./middlewares/arcjetMiddleware.js"
import {app,server} from "./config/socket.js"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);





app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
// app.use(arcjetProtection);



app.get("/",(req,res)=>{
  return res.status(200).json({
    "message":"hello this is chat app"
  })
})

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);


async function initDB() {
  try {
    await createTables();
    console.log("DB Connected");
    server.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("error in conneecting DB:",err);
  }
}
initDB();



// if(process.env.NODE_ENV === "production"){
//   app.use(express.static(path.join(__dirname, "..", "frontend", "dist")))
//   app.get("/{*any}",(req,res)=>{
//     console.log(path.resolve(__dirname, "..", "frontend", "dist", "index.html"))
//     res.sendFile(path.resolve(__dirname, "..", "frontend", "dist", "index.html"))
//   })
// }


// async function initDB() {
//   try {
//     await sql`
//       CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         email TEXT NOT NULL UNIQUE,
//         password TEXT NOT NULL,
//         name TEXT NOT NULL,
//         isVerified BOOLEAN DEFAULT FALSE,
//         resetPasswordToken TEXT,
//         resetPasswordExpiresAt TIMESTAMP,
//         verificationToken TEXT,
//         verificationTokenExpiresAt TIMESTAMP
//       );
//     `;
//     console.log("Database initialized successfully");
//   } catch (error) {
//     console.log("Error initDB", error);
//   }
// }
// initDB().then(()=>{
    
//     app.listen(process.env.PORT,()=>{
//     console.log(`server is running on port ${process.env.PORT}`);
//     })
// }
// )

