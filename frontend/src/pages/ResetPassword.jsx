import { Link,useSearchParams ,useNavigate} from "react-router";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const resetPasswordToken = searchParams.get("resetPasswordToken");
  const {isLoading,error,resetPassword} = useAuthStore();
  const navigate = useNavigate();
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        await resetPassword(newPassword,resetPasswordToken);
        navigate("/password-updated")
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
            Create New Password
          </h1>

          <div className="w-10 h-1 bg-red-500 rounded-full mt-2 mb-4" />

          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            Enter your new password below to secure your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div className="relative">
              <input
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                className="
                  w-full
                  rounded-lg
                  bg-[#252525]
                  px-4
                  py-3
                  pr-12
                  text-white
                  placeholder-gray-500
                  border
                  border-transparent
                  outline-none
                  transition
                  focus:border-red-500
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

            {/* Submit */}
            <button
              disabled={isLoading}
              type="submit"
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
              {!isLoading?"Update Password":"wait"}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-gray-600">
            Choose a strong password that you haven't used before.
          </p>
        </div>
      </div>
    </div>
  );
}