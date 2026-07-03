import {useState} from 'react'
import { Link ,useNavigate} from 'react-router';
import { useAuthStore } from '../store/authStore';
import VerifyEmail from './VerifyEmail';
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const {forgotPassword,isLoading,error} = useAuthStore();
  const navigate = useNavigate();
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      navigate("/reset-link-sent")
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#161616] rounded-2xl shadow-2xl overflow-hidden">
        {/* Top Border */}
        <div className="h-1 bg-red-500" />

        <div className="p-8">
          {/* Header */}
          <h1 className="text-3xl font-bold text-white">
            Forgot Password
          </h1>

          <div className="w-10 h-1 bg-red-500 rounded-full mt-2 mb-4" />

          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            Enter the email associated with your account and we'll send you a
            link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email Address"
              className="
                w-full
                rounded-lg
                bg-[#252525]
                px-4
                py-3
                text-white
                placeholder-gray-500
                border
                border-transparent
                outline-none
                transition
                focus:border-red-500
              "
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full
                rounded-lg
                bg-red-500
                py-3
                font-semibold
                text-white
                transition
                hover:bg-red-600
              "
            >
              {!isLoading ? "Send Reset Link" : "wait..."}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <button
              className="
                text-sm
                text-gray-400
                hover:text-red-500
                transition
              "
            >
              <Link to="/login">Back to Login</Link>
            </button>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-gray-600">
            If an account exists with this email, you'll receive a password
            reset link shortly.
          </p>
        </div>
      </div>
    </div>
  );
}
