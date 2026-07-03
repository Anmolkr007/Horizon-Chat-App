import {create} from "zustand"
import axios from "axios"
import {useAuthStore} from "./authStore.js"
const API_URL = "http://localhost:3000"
axios.defaults.withCredentials = true;
export const useChatStore = create((set,get) => ({
    allUser: [],
    allFriend: [],
    messages: [],
    selectedUser: null,
    error: null,
    isUserLoading: false,
    isMessageLoading:false,
    getUserById : async(id,profilepic,name)=>{
        try {
            const { accessToken:token } = useAuthStore.getState();
            set({isMessageLoading:true,error:null});
            const response = await axios.get(`${API_URL}/api/messages/${id}`,{headers: {Authorization: `Bearer ${token}`}});
            set({isMessageLoading:false,
                selectedUser:{id:id,name:name,profilepic_url:profilepic,relationshipStatus:response.data?.relationshipStatus,blockedBy:response.data?.blockedBy,requestSender:response.data?.requestSender}
            });
        } catch (error) {
            console.log("error in axios getUserById:",error);
            
            set({
                error: error.response.data.message,
                isMessageLoading: false
            })
            throw error;
        }
    },
    setSearchedUser : (matches,filter)=>{
        if(filter === "all")set({allUser:matches});
        else set({allFriend:matches});
    },
    getAllFriends : async ()=>{
        try {
            const { accessToken:token } = useAuthStore.getState();
            set({isUserLoading:true,error:null});
            const response = await axios.get(`${API_URL}/api/messages/getAllFriends`,{headers: {Authorization: `Bearer ${token}`}});
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
    getAllUsers : async ()=>{
        try {
            const { accessToken:token } = useAuthStore.getState();
            set({isUserLoading:true,error:null});
            const response = await axios.get(`${API_URL}/api/messages/getAllUsers`,{headers: {Authorization: `Bearer ${token}`}});
            set({allUser:response.data.users,isUserLoading:false})
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
