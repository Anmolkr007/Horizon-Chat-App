import {useState} from 'react'
import { Link,useNavigate } from 'react-router';
import { useAuthStore } from '../store/authStore.js';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {login,isLoading,error} = useAuthStore();
  console.log(email);
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      await login(email,password);
      navigate("/home-page");

    } catch (error) {
      console.log(error);
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
            Welcome Back
          </h1>

          <div className="w-10 h-1 bg-red-500 rounded-full mt-2 mb-3" />

          <p className="text-sm text-gray-400 mb-8">
            Login to continue to your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                outline-none
                border
                border-transparent
                focus:border-red-500
                transition
              "
            />

            {/* Password */}
            <div className="relative">
              <input
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="
                  w-full
                  rounded-lg
                  bg-[#252525]
                  px-4
                  py-3
                  pr-12
                  text-white
                  placeholder-gray-500
                  outline-none
                  border
                  border-transparent
                  focus:border-red-500
                  transition
                "
              />

              <button
                onClick={() => setShowPassword(!showPassword)}
                type="button"
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                  hover:text-gray-300
                "
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="
                  text-sm
                  text-red-500
                  hover:text-red-400
                "
              >
                <Link to="/forgot-password">Forgot Password?</Link>
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            {/* Login Button */}
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
              {!isLoading?"Login":"wait..."}
            </button>
          </form>

          {/* Divider */}
          <div className="my-7 flex items-center">
            <div className="h-px flex-1 bg-gray-700" />

            <span className="px-4 text-sm text-gray-500">
              or
            </span>

            <div className="h-px flex-1 bg-gray-700" />
          </div>

          {/* Signup Link */}
          <p className="text-center text-sm text-gray-400">
            Don't have an account?
            <button className="ml-1 text-red-500 hover:text-red-400">
              <Link to="/signup">Sign Up</Link>
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}