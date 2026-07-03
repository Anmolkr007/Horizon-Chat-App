import {create} from "zustand"
import axios from "axios"
import {useAuthStore} from "./authStore.js"
const API_URL = "http://localhost:3000/api/auth"
axios.defaults.withCredentials = true;
const {accessToken} = useAuthStore();
export const useChatStore = create((set,get) => ({
    allUser: [],
    allFriend: [],
    messages: [],
    selectedUser: null,
    error: null,
    isUserLoading: false,
    isMessageLoading:false,
    getAllFriends = async ()=>{
        try {
            set({isUserLoading:true,error:null});
            const response = await axios.get(`${API_URL}/api/messages/getAllFriends`,{},{headers: {Authorization: `Bearer ${accessToken}`}});
            set({allFriend:response.data.friends,isUserLoading:false})
        } catch (error) {
            console.log("error in axios getAllFriend:",error);
            
            set({
                error: error.response.data.message,
                isUserLoading: false,
            })
            throw error;
        }
    },
    getAllUsers = async ()=>{
        try {
            set({isUserLoading:true,error:null});
            const response = await axios.get(`${API_URL}/api/messages/getAllUsers`,{},{headers: {Authorization: `Bearer ${accessToken}`}});
            set({allUser:response.data.friends,isUserLoading:false})
        } catch (error) {
            console.log("error in axios getAllUser:",error);
            
            set({
                error: error.response.data.message,
                isUserLoading: false,
            })
            throw error;
        }
    }
}))
