import { sql } from "../config/DB.js";

export const messagesTable = async () => {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,

        sender_id INTEGER NOT NULL REFERENCES users(id),

        receiver_id INTEGER NOT NULL REFERENCES users(id),

        message TEXT,

        message_type TEXT DEFAULT 'text',

        is_read BOOLEAN DEFAULT FALSE,

        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
  } catch (error) {
    console.log("error in messagesTable:", error);
    throw error;
  }
};