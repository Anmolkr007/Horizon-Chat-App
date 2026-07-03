import { sql } from "../config/DB.js";

export const usersTable = async()=>{
    try {
        await sql`
        CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        bio TEXT,
        profilePic_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        isVerified BOOLEAN DEFAULT FALSE,
        resetPasswordToken TEXT,
        resetPasswordExpiresAt TIMESTAMP,
        verificationToken TEXT,
        verificationTokenExpiresAt TIMESTAMP
      );
    `;
    }
    catch(error) {
        console.log("error in usersTable: ",error);
        throw error;
    }
}

