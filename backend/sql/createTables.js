import {usersTable} from "./usersTable.js"
import {messagesTable} from "./messagesTable.js"
import {friendRequestTable} from "./friendRequestTable.js"


export const createTables = async()=>{
    try {
        await usersTable();
        await messagesTable();
        await friendRequestTable();
    } catch (error) {
        console.log("error in createtables:",error);
        throw error;
    }
}