import {create} from "zustand"
import axios from "../utils/axios.js"
import toast from "react-hot-toast"
import {io} from "socket.io-client"
import {useChatStore} from "./chatStore.js"


export const useAuthStore = create((set,get) => ({
    user: null,
    accessToken: null,
    error: null,
    isLoading: false,
    isAuthenticated: false,
    isCheckingAuth: true,
    socket: null,
    onlineUsers: [],
    updateProfile: async (formData) => {
  try {
    const { accessToken: token } = get();

    set({ isLoading: true, error: null });

    const response = await axios.post(
      "/api/auth/updateProfile",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    set((state) => ({
        user: {
          ...state.user,
          ...response.data.user,
        },
      isLoading: false,
    }));

    toast.success(response.data.message||"Profile updated successfully");
  } catch (error) {
    set({
      isLoading: false,
      error: error.response?.data?.message,
    });

    toast.error(
      error.response?.data?.message || "Failed to update profile."
    );

    throw error;
  }
},
    resetPassword: async (newPassword, resetPasswordToken)=>{
        try {
            set({isLoading:true,error:null})
            const response = await axios.post(`/api/auth/resetPassword`,{newPassword,resetPasswordToken})
            set({isLoading:false})
        } catch (error) {
            console.log(error);
            set({
                isLoading:false,error:error.response.data.message || "Something went wrong"
            })
        }
    },
    forgotPassword: async(email)=>{
        set({isLoading:true,error:null});
        try {
            await axios.post(`/api/auth/forgotPassword`,{email})
            set({isLoading:false,error:null})
        } catch (error) {
            console.log(error);
            set({isLoading:false,error:error.response.data.message})
            throw error;
        }
    },
    signup: async (name, email, password) => {
        set({isLoading: true, error: null});
        try {
            const response = await axios.post(`/api/auth/signup`, { name, email, password });
            set({ isLoading: false });
            toast.success("Signup successful! Please check your email for verification.");
        } catch (error) {
            set({ isLoading: false, error: error.response.data.message });
            toast.error(error.response.data?.message || "Signup failed. Please try again.");
            throw error;
        }
    },
    verifyEmail: async(token)=>{
        try {
            set({isLoading:true,error:null});
            const response = await axios.post(`/api/auth/verifyEmail`,{verificationToken:token});
            set({isLoading:false,error:null,})
        } catch (error) {
            console.log("error in verifyEmail:",error);
            set({isLoading:false,error:error.response.data.message});
            throw error;
        }
    },
    login: async (email,password)=>{
        set({isLoading:true,error:null});
        try {
            const response = await axios.post(`/api/auth/login`,{email,password});
            set({
                user:response.data.user,
                accessToken:response.data.accessToken,
                isAuthenticated:true,
                isLoading:false,
            });
            get().connectSocket();
        }
        catch (error) {
            console.log("Error in login ",error);
            set({
                error:error.response.data.message,
                user:null,
                accessToken:null,
                isAuthenticated:false,
                isLoading:false,
            });
            throw error;
        }
    },
    checkAuth: async () =>{
        try {
            const response = await axios.post(`/api/auth/refreshToken`);
            set({
                error:null,
                user:response.data.user,
                accessToken:response.data.accessToken,
                isAuthenticated:true,
            })
            get().connectSocket();
            await useChatStore
            .getState()
            .getUnreadNotifications();
            console.log("notifications in checkAuth:", useChatStore.getState().notifications);
        } catch (error) {
            console.log("error in checkAuth",error);
            set({
                error:error.response?.data?.message || "Something went wrong",
                user: null,
                accessToken: null,
                isAuthenticated:false,
            })
            get().disconnectSocket();
        }
        finally{
            set({isCheckingAuth:false})
        }
    },
    clearAuth: () => {
    get().disconnectSocket();

    set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        onlineUsers: [],
        error: null,
        socket: null,
    });
    },
    logout: async ()=>{
        set({
            isLoading:true,error:null
        });
        try {
            const token = get().accessToken;
            await axios.post(`/api/auth/logout`,{},{headers: {Authorization: `Bearer ${token}`}});
            set({
                user:null,
                accessToken:null,
                isAuthenticated: false,
                isLoading: false,
                onlineUsers: [],
            })
            get().disconnectSocket();
        } catch (error) {
            console.log("axios logout error",error)
            set({
                error: error.response.data.message,
                isLoading: false,
            })
            throw error;
        }
    },
    connectSocket: () => {
        console.log("connectSocket called");
            const {isAuthenticated} = get();
            if(!isAuthenticated || get().socket?.connected) return;
            const socket = io(axios.defaults.baseURL, {
                auth: {
                    token: get().accessToken
                }
            });
            socket.connect();
            set({ socket });
            socket.on("getOnlineUsers",(userIds)=>{
                set({onlineUsers:userIds})
            });
            socket.on("newNotification", ( senderId ) => {
                const { selectedUser } = useChatStore.getState();
                if (selectedUser?.id === senderId) return;
            useChatStore.setState((state) => ({
            notifications: {
            ...state.notifications,
            [senderId]: (state.notifications[senderId] || 0) + 1,
            },
            }));
            });
            socket.on("newUserRegistered", async () => {
                const { getAllUsers } = useChatStore.getState();
                await getAllUsers();
            });

        
    },
    disconnectSocket: () => {
        if(get().socket?.connected){
            get().socket.disconnect();
            set({ socket: null });
        }
    }
}))
