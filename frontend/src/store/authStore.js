import {create} from "zustand"
import axios from "axios"
import toast from "react-hot-toast"
import {io} from "socket.io-client"

const API_URL = "http://localhost:3000"
axios.defaults.withCredentials = true;
export const useAuthStore = create((set,get) => ({
    user: null,
    accessToken: null,
    error: null,
    isLoading: false,
    isAuthenticated: false,
    isCheckingAuth: true,
    socket: null,
    onlineUsers: [],
    resetPassword: async (newPassword, resetPasswordToken)=>{
        try {
            set({isLoading:true,error:null})
            const response = await axios.post(`${API_URL}/api/auth/resetPassword`,{newPassword,resetPasswordToken})
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
            await axios.post(`${API_URL}/api/auth/forgotPassword`,{email})
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
            const response = await axios.post(`${API_URL}/api/auth/signup`, { name, email, password });
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
            const response = await axios.post(`${API_URL}/api/auth/verifyEmail`,{verificationToken:token});
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
            const response = await axios.post(`${API_URL}/api/auth/login`,{email,password});
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
            const response = await axios.post(`${API_URL}/api/auth/refreshToken`);
            set({
                error:null,
                user:response.data.user,
                accessToken:response.data.accessToken,
                isAuthenticated:true,
                isCheckingAuth:false,
            })
            get().connectSocket();
        } catch (error) {
            console.log("error in checkAuth",error);
            set({
                error:null,
                user: null,
                accessToken: null,
                isAuthenticated:false,
                isCheckingAuth:false,
            })
            get().disconnectSocket();
        }
    },
    logout: async ()=>{
        set({
            isLoading:true,error:null
        });
        try {
            const token = get().accessToken;
            await axios.post(`${API_URL}/api/auth/logout`,{},{headers: {Authorization: `Bearer ${token}`}});
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
            const {isAuthenticated} = get();
            if(!isAuthenticated || get().socket?.connected) return;
            const socket = io(API_URL, {
                auth: {
                    token: get().accessToken
                }
            });
            socket.connect();
            set({ socket });
            socket.on("getOnlineUsers",(userIds)=>{
                set({onlineUsers:userIds})
            });
        
    },
    disconnectSocket: () => {
        if(get().socket?.connected){
            get().socket.disconnect();
            set({ socket: null });
        }
    }
}))
