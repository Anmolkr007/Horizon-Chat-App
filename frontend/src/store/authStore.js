import {create} from "zustand"
import axios from "axios"
const API_URL = "http://localhost:3000/api/auth"
axios.defaults.withCredentials = true;
export const useAuthStore = create((set,get) => ({
    user: null,
    accessToken: null,
    error: null,
    isLoading: false,
    isAuthenticated: false,
    isCheckingAuth: true,
    resetPassword: async (newPassword, resetPasswordToken)=>{
        try {
            set({isLoading:true,error:null})
            const response = await axios.post(`${API_URL}/resetPassword`,{newPassword,resetPasswordToken})
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
            await axios.post(`${API_URL}/forgotPassword`,{email})
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
            const response = await axios.post(`${API_URL}/signup`, { name, email, password });
            set({ isLoading: false });
        } catch (error) {
            set({ isLoading: false, error: error.response.data.message });
            throw error;
        }
    },
    verifyEmail: async(token)=>{
        try {
            set({isLoading:true,error:null});
            const response = await axios.post(`${API_URL}/verifyEmail`,{verificationToken:token});
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
            const response = await axios.post(`${API_URL}/login`,{email,password});
            set({
                user:response.data.user,
                accessToken:response.data.accessToken,
                isAuthenticated:true,
                isLoading:false,
                error:null,
            })
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
            const response = await axios.post(`${API_URL}/refreshToken`);
            set({
                error:null,
                user:response.data.user,
                accessToken:response.data.accessToken,
                isAuthenticated:true,
                isCheckingAuth:false,
            })
            
        } catch (error) {
            console.log("error in checkAuth",error);
            set({
                error:null,
                user: null,
                accessToken: null,
                isAuthenticated:false,
                isCheckingAuth:false,
            })
        }
    },
    logout: async ()=>{
        set({
            isLoading:true,error:null
        });
        try {
            const token = get().accessToken;
            await axios.post(`${API_URL}/logout`,{},{headers: {Authorization: `Bearer ${token}`}});
            set({
                user:null,
                accessToken:null,
                isAuthenticated: false,
                error: null,
                isLoading: false,
            })
        } catch (error) {
            console.log("axios logout error",error)
            set({
                error: error.response.data.message,
                isLoading: false,
            })
            throw error;
        }
    }
}))
