import {create} from "zustand"
import axios from "../utils/axios.js"
import {useAuthStore} from "./authStore.js"
import toast from "react-hot-toast"

export const useChatStore = create((set,get) => ({
    allUser: [],
    allFriend: [],
    displayUser: [],
    displayFriend: [],
    messages: [],
    selectedUser: null,
    error: null,
    isTyping: false,
    isUserLoading: false,
    isMessageLoading:false,
    isUploading:false,
    notifications:{},
    isNotificationLoading:false,
    requestLoading:false,
    setSelectedUser: ()=>{
        set({
            selectedUser:null,
        })
    },
    handleRequest: async (action)=>{
        try{
            const {selectedUser} = get();
            const { accessToken:token } = useAuthStore.getState();
            set({requestLoading:true,error:null});
            const response = await axios.patch(`/api/messages/handleFriendRequest/${selectedUser.id}`,{status:action},{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            set({requestLoading:false,
                    selectedUser: {
                ...get().selectedUser,
                relationshipStatus: response.data?.relationshipStatus,
                blockedBy: response.data?.blockedBy,
            }
            });
            toast.success(response.data?.message );
        }
        catch (error) {
            set({requestLoading:false,error:error.response.data?.message});
            toast.error(error.response.data?.message || "Failed to handle friend request.");
            console.log("error in axios handleRequest:",error);
            throw error;
        }
    },
    deleteRequest: async()=>{
        try{
            const {selectedUser} = get();
            const { accessToken:token } = useAuthStore.getState();
            set({requestLoading:true,error:null});
            const response = await axios.delete(`/api/messages/deleteFriendRequest/${selectedUser.id}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            set({requestLoading:false,
                    selectedUser: {
                ...get().selectedUser,
                relationshipStatus: response.data?.relationshipStatus
            }
            });
            toast.success(`Friend request to ${selectedUser.name} cancelled.`);
        }
        catch (error) {
            set({requestLoading:false,error:error.response.data?.message});
            toast.error(error.response.data?.message || "Failed to delete friend request.");
            console.log("error in axios deleteRequest:",error);
            throw error;
        }
    },
    sendFriendRequest: async()=>{
        try {
            const {selectedUser} = get();
            const { accessToken:token } = useAuthStore.getState();
            set({requestLoading:true,error:null});
            const response = await axios.post(`/api/messages/sendFriendRequest/${selectedUser.id}`,{},{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            set({requestLoading:false,
                 selectedUser: {
                ...get().selectedUser,
                relationshipStatus: response.data?.relationshipStatus,
                requestSender: response.data?.requestSender
            },
            });
            toast.success(`Friend request sent to ${selectedUser.name}!`);
        }
        catch (error) {
            set({requestLoading:false,error:error.response.data?.message});
            toast.error(error.response.data?.message || "Failed to send friend request.");
            console.log("error in axios sendFriendRequest:",error);
            throw error;
        }
    },
    clearNotifications: (userId) => {
    const notifications = { ...get().notifications };

    delete notifications[userId];

    set({ notifications });
},
    getUnreadNotifications: async () => {
    try {
        const { accessToken: token } = useAuthStore.getState();

        set({
            isNotificationLoading: true,
            error: null,
        });

        const response = await axios.get(
            `/api/messages/getUnreadMessagesCount`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const notifications = {};

        response.data?.unreadMessages.forEach((item) => {
            notifications[item.sender_id] = item.count;
        });

        set({
            notifications,
            isNotificationLoading: false,
        });
    } catch (error) {
        console.log(error);

        set({
            isNotificationLoading: false,
        });
    }
},
    sendMessage : async ( formData,id, selectedFile, text)=>{
        //creating optimisticMessage
            const { user } = useAuthStore.getState();
            let optimisticMessage = {
                id: `temp-${Date.now()}`,
                sender_id: user.id,
                receiver_id: id,
                message: "",
                message_type: "text",
                created_at: new Date().toISOString(),
                //this extra field will be used for showing sending loader
                isSending: true,
            };
        
        try {
            //if file not exist , this means message is text
            if (!selectedFile) {
                optimisticMessage.message = text;
                optimisticMessage.message_type = "text";
            }
            //if file exist then check its type
            if (selectedFile) {
                const preview = URL.createObjectURL(selectedFile);
                optimisticMessage.message = preview;

                if (selectedFile.type.startsWith("image/"))
                    optimisticMessage.message_type = "image";

                else if (selectedFile.type.startsWith("video/"))
                    optimisticMessage.message_type = "video";

                else if (selectedFile.type.startsWith("audio/"))
                    optimisticMessage.message_type = "audio";

                else
                    optimisticMessage.message_type = "file";
            }

            const { accessToken:token } = useAuthStore.getState();
            set((state) => ({
                isUploading:true,
                messages: [...state.messages, optimisticMessage],
            }));
            const response = await axios.post(`/api/messages/sendMessage/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            set(state=>({
                isUploading:false,
                messages: state.messages.map(msg =>
                    msg.id === optimisticMessage.id
                        ? response.data.sentMessage
                        : msg
                )
            }));
        } catch (error) {
            set(state=>({
                isUploading:false,
                messages: state.messages.filter(
                    msg => msg.id !== optimisticMessage.id
                )
            }));
            toast.error(error.response?.data?.message || "Failed to send message.");
            console.log("error in axios sendMessage:",error);
            throw error;
        }
        finally {
            if (selectedFile && optimisticMessage?.message?.startsWith("blob:")) {
                URL.revokeObjectURL(optimisticMessage.message);
            }
        }
    },
    getUserById : async(id,profilepic,name)=>{
        try {
            const { accessToken:token } = useAuthStore.getState();
            set({
            error: null,
            isMessageLoading: true,
            selectedUser: {
                id,
                name,
                profilepic_url: profilepic,
            },
            messages: [],
        });
            // set({isMessageLoading:true,error:null});
            const response = await axios.get(`/api/messages/${id}`,{headers: {Authorization: `Bearer ${token}`}});
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
                selectedUser: null,
                error: error.response.data.message,
                isMessageLoading: false
            })
            toast.error(error.response.data?.message || "Failed to fetch user messages.");  
            throw error;
        }
    },
    setSearchedUser : (matches,filter)=>{
        if(filter === "all")set({displayUser:matches});
        else set({displayFriend:matches});
    },
    getAllFriends : async ()=>{
        try {
            const { accessToken:token } = useAuthStore.getState();
            set({isUserLoading:true,error:null});
            const response = await axios.get(`/api/messages/getAllFriends`,{headers: {Authorization: `Bearer ${token}`}});
            set({allFriend:response.data.friends,
                displayFriend:response.data.friends,
                isUserLoading:false})
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
            console.log("getAllUsers called");
            const { accessToken:token } = useAuthStore.getState();
            set({isUserLoading:true,error:null});
            const response = await axios.get(`/api/messages/getAllUsers`,{headers: {Authorization: `Bearer ${token}`}});
            set({allUser:response.data.users,
                displayUser:response.data.users,
                isUserLoading:false})
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
    markMessagesRead: (readerId) => {
    set((state) => ({
        messages: state.messages.map(msg =>
            msg.receiver_id == readerId
                ? { ...msg, is_read: true }
                : msg
        )
    }));
    },   
    subscribeToMessage : ()=>{
        const {selectedUser} = get();
        if(!selectedUser) return;
        const socket = useAuthStore.getState().socket;
        if(!socket) return;
        socket.on("newMessage",(newMessage)=>{
            if(newMessage.sender_id !== selectedUser.id) return;
            set((state) => ({
            messages: [...state.messages, newMessage],
            }));
            socket.emit("messageRead", {
            messageId: newMessage.id,
            });
        })
        socket.on("userTyping", ({ userId }) => {

            const { selectedUser } = useChatStore.getState();

            if (selectedUser?.id !== userId) return;

            useChatStore.setState({
                isTyping: true,
            });

        });
        socket.on("userStoppedTyping", ({ userId }) => {

            const { selectedUser } = useChatStore.getState();

            if (selectedUser?.id !== userId) return;

            useChatStore.setState({
                isTyping: false,
            });

        });
    },
    unsubscribeFromMessage : ()=>{
        const socket = useAuthStore.getState().socket;
        if(!socket) return;
        socket.off("newMessage");
        socket.off("userTyping");
        socket.off("userStoppedTyping");
    }
}))
