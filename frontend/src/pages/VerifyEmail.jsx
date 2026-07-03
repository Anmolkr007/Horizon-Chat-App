
import {Link} from 'react-router';



export default function VerifyEmail() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#161616] rounded-2xl shadow-2xl overflow-hidden">
        {/* Top Border */}
        <div className="h-1 bg-red-500" />

        <div className="p-8 text-center">
          {/* Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
            <span className="text-4xl">✉️</span>
          </div>

          {/* Heading */}
          <h1 className="mt-6 text-3xl font-bold text-white">
            Check Your Email
          </h1>

          <div className="w-10 h-1 bg-red-500 rounded-full mx-auto mt-2 mb-5" />

          {/* Message */}
          <p className="text-gray-400 leading-relaxed">
            We've sent a verification link to your email address.
            Please open your inbox and click the link to activate your account.
          </p>

          {/* Optional Email */}
          {/* 
          <p className="mt-4 text-sm text-gray-500">
            Sent to: <span className="text-gray-300">{email}</span>
          </p>
          */}

          {/* Login Link */}
          <button
            className="
              mt-10
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
            <Link to="/login">Back to Login</Link>
          </button>

          {/* Footer */}
          <p className="mt-6 text-xs text-gray-600">
            After verifying your email, you can log in to your account.
          </p>
        </div>
      </div>
    </div>
  );
}