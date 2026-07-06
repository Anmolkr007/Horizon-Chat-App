import {create} from "zustand"
import axios from "axios"
import {useAuthStore} from "./authStore.js"
import toast from "react-hot-toast"
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
    isUploading:false,
    sendMessage : async (formData,id)=>{
        try {
            const {messages} = get();
            const { accessToken:token } = useAuthStore.getState();
            set({isUploading:true});
            const response = await axios.post(`${API_URL}/api/messages/sendMessage/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            set({isUploading:false,messages:[...messages,response.data.sentMessage]});
        } catch (error) {
            set({isUploading:false,error:error.response.data.message});
            toast.error(error.response.data?.message || "Failed to send message.");
            console.log("error in axios sendMessage:",error);
            throw error;
        }
    },
    getUserById : async(id,profilepic,name)=>{
        try {
            const { accessToken:token } = useAuthStore.getState();
            set({isMessageLoading:true,error:null});
            const response = await axios.get(`${API_URL}/api/messages/${id}`,{headers: {Authorization: `Bearer ${token}`}});
            set({
                isMessageLoading: false,

                selectedUser: {
                    id,
                    name,
                    profilepic_url: profilepic,
                    relationshipStatus: response.data.relationshipStatus,
                    blockedBy: response.data?.blockedBy,
                    requestSender: response.data?.requestSender,
                },

                messages: response.data?.messages || [],
            });
        } catch (error) {
            console.log("error in axios getUserById:",error);
            
            set({
                error: error.response.data.message,
                isMessageLoading: false
            })
            toast.error(error.response.data?.message || "Failed to fetch user messages.");  
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
            toast.error(error.response.data?.message || "Failed to fetch friends.");
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
            toast.error(error.response.data?.message || "Failed to fetch users.");
            throw error;
        }
    },
    subscribeToMessage : ()=>{
        const {selectedUser} = get();
        if(!selectedUser) return;
        const socket = useAuthStore.getState().socket;
        if(!socket) return;
        socket.on("newMessage",(newMessage)=>{
            const currentMessages = get().messages;
            set({messages:[...currentMessages,newMessage]});
        })
    },
    unsubscribeFromMessage : ()=>{
        const socket = useAuthStore.getState().socket;
        if(!socket) return;
        socket.off("newMessage");
    }
}))
