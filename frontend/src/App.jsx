import React from 'react'
import { Routes, Route ,Navigate} from 'react-router'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetLinkSent from './pages/ResetLinkSent.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import ChatPage  from "./pages/ChatPage.jsx"
import EmailVerified from './pages/EmailVerified.jsx'
import PasswordUpdated from './pages/PasswordUpdated.jsx'
import EmailVerification from './pages/EmailVerification.jsx'
import { useAuthStore } from './store/authStore.js'
import { useEffect } from 'react'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import RedirectedRoute from './components/RedirectedRoute.jsx'
import EmptyConversationPage from './pages/EmptyConversationPage.jsx'
const App = () => {
  const {checkAuth,isAuthenticated,isCheckingAuth} = useAuthStore();
  useEffect(()=>{
    checkAuth();
  },[])
  if (isCheckingAuth) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="h-14 w-14 mx-auto rounded-full border-4 border-red-500/20 border-t-red-500 animate-spin" />

                    <p className="mt-4 text-gray-400">
                        Restoring your session...
                    </p>
                </div>
            </div>
        );
  }


  return (
    <Routes>

      <Route
        path="/home-page"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      >
        <Route index element={<EmptyConversationPage />} />
        {/* <Route path=":userId" element={<ConversationPage />} />
        <Route path="profile" element={<ProfilePage />} /> */}
      </Route>

      <Route path = "/login" element = {
        <RedirectedRoute>
          <Login/>
        </RedirectedRoute>
      } />
      <Route path = "/signup" element = {
        <RedirectedRoute>
          <Signup/>
        </RedirectedRoute>
      } />
      <Route path = "/verify-email" element = {<RedirectedRoute>
          <VerifyEmail/>
        </RedirectedRoute>} />
      <Route path = "/forgot-password" element = {
        <RedirectedRoute>
          <ForgotPassword/>
        </RedirectedRoute>
      } />
      <Route path = "/reset-link-sent" element = {
        <RedirectedRoute>
          <ResetLinkSent/>
        </RedirectedRoute>
      } />
      <Route path = "/reset-password" element = {
        <RedirectedRoute>
          <ResetPassword/>
        </RedirectedRoute>} />
      <Route path = "/email-verified" element = {
        <RedirectedRoute>
          <EmailVerified/>
        </RedirectedRoute>
      } />
      <Route path = "/password-updated" element = {
        <RedirectedRoute>
          <PasswordUpdated/>
        </RedirectedRoute>
      } />
      <Route path = "/email-verification" element = {
        <RedirectedRoute>
          <EmailVerification/>
        </RedirectedRoute>
      }/>
      <Route path = "*" element = {
        <div>404 page not found</div>
      } />
    </Routes>
  )
}

export default App