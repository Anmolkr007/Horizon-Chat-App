import { sql } from "../config/DB.js";

export const friendRequestTable = async () => {
  try {
    //status can be -> pending, accept, reject, blocked
    await sql`
      CREATE TABLE IF NOT EXISTS friendRequests (
        id SERIAL PRIMARY KEY,

        sender_id INTEGER NOT NULL REFERENCES users(id),

        receiver_id INTEGER NOT NULL REFERENCES users(id),

        status text default 'pending',

        blocked_by INTEGER REFERENCES users(id) default null,

        created_at TIMESTAMPTZ DEFAULT NOW(),

        UNIQUE(sender_id, receiver_id)
      );
    `;
  } catch (error) {
    console.log("error in messagesTable:", error);
    throw error;
  }
};