import {useState} from 'react'
import { Link ,useNavigate} from 'react-router';
import {useAuthStore} from '../store/authStore.js';


export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {signup,error,isLoading} = useAuthStore();
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      await signup(fullName, email, password);
      navigate('/verify-email');
    }
    catch (error) {
      console.error("Error during signup:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#161616] rounded-2xl shadow-2xl overflow-hidden">
        {/* Top Border */}
        <div className="h-1 bg-red-500" />

        <div className="p-8">
          {/* Header */}
          <h1 className="text-3xl font-bold text-white">
            Create Account
          </h1>

          <div className="w-10 h-1 bg-red-500 rounded-full mt-2 mb-3" />

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                type="text"
                placeholder="Full Name"
                className="w-full rounded-lg bg-[#252525] px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-red-500 transition"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email Address"
                className="w-full rounded-lg bg-[#252525] px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-red-500 transition"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full rounded-lg bg-[#252525] px-4 py-3 pr-12 text-white placeholder-gray-500 outline-none border border-transparent focus:border-red-500 transition"
              />

              {/* Eye Button */}
              <button
                onClick={() => setShowPassword(!showPassword)}
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            {/* Sign Up */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600"
            >
              {isLoading ? "Wait..." : "Sign Up"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-7 flex items-center">
            <div className="h-px flex-1 bg-gray-700" />
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="h-px flex-1 bg-gray-700" />
          </div>

          {/* Login */}
          <p className="text-center text-sm text-gray-400">
            Already have an account?
            <button className="ml-1 text-red-500 hover:text-red-400">
              <Link to="/login">Login</Link>
            </button>
          </p>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-gray-600">
            A verification email will be sent to your inbox after signup.
          </p>
        </div>
      </div>
    </div>
  );
}