import { sql } from "../config/DB.js"
import { v4 as uuid } from "uuid";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import { io, getReceiverSocketId } from "../config/socket.js";


export const getAllUsers = async (req, res) => {
    try {
        const loggedInUser = req.user?.id
        const result = await sql`select id,name,profilepic_url,bio from users where id != ${loggedInUser} and isVerified = true`;
        return res.status(200).json({ success: true, message: "succeccfully all user fetched", users: result });
    } catch (error) {
        console.log("error in getAllUsers:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
export const getMessagesById = async (req, res) => {
    try {
        const senderId = req.user.id;
        const receiverId = req.params.id;
        if (isNaN(receiverId))
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        //check if both are friend or not
        const relationship = await sql`
        SELECT *
        FROM friendRequests
        WHERE
            (
                sender_id = ${senderId}
                AND receiver_id = ${receiverId}
            )
            OR
            (
                sender_id = ${receiverId}
                AND receiver_id = ${senderId}
            )
        `;
        if (relationship.length === 0) {
        return res.status(200).json({
            success: true,
            message:"not friend, send request first",
            relationshipStatus: "none"
        });
        }
        else if (relationship[0].status === 'declined') {
            await sql`
            DELETE FROM friendRequests
            WHERE id = ${relationship[0].id}
            `;
        return res.status(200).json({
            success: true,
            message:"not friend, send request first",
            relationshipStatus: "none"
        });
        }
        else if (relationship[0].status === 'pending') {
            let s = "";
            relationship[0].sender_id == receiverId ? s="request_received" : s="request_sent";
        return res.status(200).json({
            success: true,
            messages: "request is sent, check who is sender",
            relationshipStatus: s,
            requestSender: relationship[0].sender_id
        });
        }
        else if (relationship[0].status === 'blocked') {
            let s = "";
            relationship[0].blocked_by  ==  receiverId ? s="blocked_by_user" : s="blocked_by_me";
        return res.status(200).json({
            success: false,
            message: "User is blocked",
            relationshipStatus:s,
            BlockedBy: relationship[0].blocked_by
        });
        }
        //if you are here means both are friend and status is accepted
        //showing all messages if both are friend
        const result = await sql`SELECT *
                FROM messages
                WHERE
                (sender_id = ${senderId} AND receiver_id = ${receiverId})
                    OR
                (sender_id = ${receiverId} AND receiver_id = ${senderId})
                ORDER BY created_at ASC`;

        return res.status(200).json({ success: true, message: "messages fetched successfully",relationshipStatus: "accepted", messages: result });

    } catch (error) {
        console.log("error in getMessagesById:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const getAllFriends = async (req, res) => {
    try {
        const { id } = req.user;
        const result = await sql`
        SELECT u.id, u.name, u.bio, u.profilePic_url
        FROM friendRequests fr
        JOIN users u
            ON (u.id = fr.sender_id OR u.id = fr.receiver_id)
        WHERE (fr.sender_id = ${id} OR fr.receiver_id = ${id})
            AND fr.status = 'accepted'
            AND u.id != ${id}
        `;

        return res.status(200).json({ success: true, message: "friend list fetched successfully", friends: result })
    } catch (error) {
        console.log("error in getAllFriends:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
export const sendFriendRequest = async (req, res) => {
    try {
        const {id:receiverId} = req.params;
        if (isNaN(receiverId))
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        const senderId = req.user.id;
        let result = await sql`
        SELECT *
        FROM friendRequests
        WHERE
            (
                sender_id = ${senderId}
                AND receiver_id = ${receiverId}
            )
            OR
            (
                sender_id = ${receiverId}
                AND receiver_id = ${senderId}
            )
        `
        if(result.length !== 0){
            if(result[0].sender_id == senderId)return res.status(400).json({success:false,message:"request already sent"});
            else return res.status(400).json({success:false,message:"you already got request"});
        }

        result = await sql`
        INSERT INTO friendRequests (sender_id, receiver_id, status, created_at)
        VALUES (${senderId}, ${receiverId}, 'pending', NOW())
        `;
        res.status(201).json({ success: true, message: "Friend request sent" });
    } catch (error) {
        console.log("error in sendFriendRequest:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
 }
export const handleFriendRequest = async (req, res) => { 
    try {
        const {id:requestSenderId} = req.params;
        if (isNaN(requestSenderId))
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        const receiverId = req.user.id; 
        const {status:newStatus} = req.body;
        const allowedStatuses = ["pending", "accepted", "declined","blocked"];

        if (!allowedStatuses.includes(newStatus)) {
        return res.status(400).json({
            success: false,
            message: "Invalid status value"
        });
        }
        await sql`
        update friendRequests
        set status = ${newStatus}
        where sender_id = ${requestSenderId} and receiver_id = ${receiverId};
        `
        return res.status(200).json({success:true,message:`Friend request ${newStatus}`})
    } catch (error) {
        console.log("error in handleFriendRequest:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
export const sendMessage = async (req, res) => {
    try {
        const {id:receiverId} = req.params;
        if (isNaN(receiverId))
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        const {id:senderId} = req.user;
        //check if both are friend or not
        const relationship = await sql`
        SELECT *
        FROM friendRequests
        WHERE
            (
                sender_id = ${senderId}
                AND receiver_id = ${receiverId}
            )
            OR
            (
                sender_id = ${receiverId}
                AND receiver_id = ${senderId}
            )
        `;
        if (relationship.length === 0 || relationship[0].status !== "accepted") {
            return res.status(403).json({
                success: false,
                message: "You are not friends with this user"
            });
        }
        const  { message } = req.body;
        let message_type = "text";
        let content = message;
        const file = req.file;
        if (!message && !file) {
            return res.status(400).json({
            success: false,
            message: "Message or file is required",
            });
        }

// Check if the receiver exists
    const receiver = await sql`
      SELECT id
      FROM users
      WHERE id = ${receiverId};
    `;

    if (receiver.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found",
      });
    }


        if (file) {
      const uniqueFileName =
        `${uuid()}-${file.originalname.split(".")[0]}`.replace(/\s+/g, "_");

      const uploadResult = await new Promise((resolve, reject) => {

        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "chatApp",
            resource_type: "auto",
            public_id: uniqueFileName,
          },

          (error, result) => {

            if (error) {
              return reject(error);
            }

            resolve(result);

          }
        );

        streamifier
          .createReadStream(file.buffer)
          .pipe(uploadStream);

      });


        content = uploadResult.secure_url;

        if (uploadResult.resource_type === "image") {
            if (uploadResult.format === "pdf") {
          message_type = "pdf";
        }
        else message_type = "image";
        
      }

      else if (uploadResult.resource_type === "video") {
        message_type = "video";
      }

      else if (uploadResult.resource_type === "raw") {

        

        
          message_type = "file";
        

      }

    }
        
        const result = await sql`
        INSERT INTO messages (sender_id, receiver_id, message, message_type, created_at)
        VALUES (${senderId}, ${receiverId}, ${content}, ${message_type}, NOW())
        RETURNING *;
        `;
        //todo:socket io emit message to receiver if he is online
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", result[0]);
        }

        return res.status(201).json({ success: true, message: "Message sent successfully", sentMessage: result[0] });

    } catch (error) {
        console.log("error in sendMessage:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
 }