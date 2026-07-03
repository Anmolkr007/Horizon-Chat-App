import express from "express"
import {getAllUsers,getAllFriends,getMessagesById,sendMessage,sendFriendRequest,handleFriendRequest} from "../controllers/messageController.js"
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(authMiddleware)//all routes are protected and user must be logged in to access them

router.get("/getAllUsers",getAllUsers)//when to load all user
router.get("/getAllFriends",getAllFriends)//to get only friends
router.post("/friendRequest/:id",sendFriendRequest)//when both user are not friend then send the request
router.patch("/handleFriendRequest/:id",handleFriendRequest)//when request is sent and want to accept decline block
// router.post("/friendRequest/:id",authMiddleware,sendFriendRequest)//when user want to unblock
router.get("/:id",getMessagesById)//when you click a user and want to load message according to that
router.post("/sendMessage/:id",sendMessage)//send message to a specific user by id

export default router;