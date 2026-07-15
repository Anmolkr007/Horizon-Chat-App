import express from "express"
import {getAllUsers,getAllFriends,getMessagesById,sendMessage,sendFriendRequest,getUnreadMessagesCount,handleFriendRequest,cancelRequest} from "../controllers/messageController.js"
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import { arcjetProtection } from "../middlewares/arcjetMiddleware.js";

const router = express.Router();
router.use(authMiddleware)//all routes are protected and user must be logged in to access them
router.use(arcjetProtection);

router.get("/getUnreadMessagesCount",getUnreadMessagesCount)//to get the count of unread messages for the logged in user
router.get("/getAllUsers",getAllUsers)//when to load all user
router.get("/getAllFriends",getAllFriends)//to get only friends

router.patch("/handleFriendRequest/:id",handleFriendRequest)//when request is sent and want to accept decline block unblock user

router.get("/:id",getMessagesById)//when you click a user and want to load message according to that
router.post("/sendMessage/:id",upload.single("file"),sendMessage)//send message to a specific user by id
router.post("/sendFriendRequest/:id",sendFriendRequest)//send friend request to a specific user by id
router.delete("/deleteFriendRequest/:id",cancelRequest)//delete friend request to a specific user by id
export default router;