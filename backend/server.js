import "dotenv/config";
import express from "express";
import authRoutes from "./routes/authRoute.js";
import messageRoutes from "./routes/messageRoute.js"
import cors from "cors";
import {sql} from "./config/DB.js";
import {createTables} from "./sql/createTables.js"
import cookieParser from "cookie-parser";
import path from "path";
// import {arcjetProtection} from "./middlewares/arcjetMiddleware.js"
import {app,server} from "./config/socket.js"

const __dirname = path.resolve();





app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
// app.use(arcjetProtection);


app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);


if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "..", "frontend", "dist")))
  app.get("/{*any}",(req,res)=>{
    res.sendFile(path.resolve(__dirname, "..", "frontend", "dist", "index.html"))
  })
}


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




