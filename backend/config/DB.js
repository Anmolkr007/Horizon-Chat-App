import {neon} from "@neondatabase/serverless"


const {DATABASE_URL} = process.env

export const sql = neon(
    DATABASE_URL
)

