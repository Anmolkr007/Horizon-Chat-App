import { Link } from "react-router";



export default function EmailVerified() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-[#161616] shadow-2xl">
        <div className="h-1 bg-red-500" />

        <div className="p-8 text-center">
          <div
            className="
              mx-auto
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-red-500/10
              border
              border-red-500/20
            "
          >
            <span className="text-4xl">✓</span>
          </div>

          <h1 className="mt-6 text-3xl font-bold text-white">
            Email Verified
          </h1>

          <div className="mx-auto mt-2 mb-5 h-1 w-10 rounded-full bg-red-500" />

          <p className="text-gray-400 leading-relaxed">
            Your email has been verified successfully.
            You can now log in to your account.
          </p>

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
        </div>
      </div>
    </div>
  );
}
