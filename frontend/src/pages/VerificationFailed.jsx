import { Link } from "react-router";

export default function VerificationFailed(props) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-[#161616] shadow-2xl">
        <div className="h-1 bg-red-500" />

        <div className="p-8 text-center">
          {/* Icon */}
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
            <span className="text-4xl text-red-500">✕</span>
          </div>

          <h1 className="mt-6 text-3xl font-bold text-white">
            Verification Failed
          </h1>

          <div className="mx-auto mt-2 mb-5 h-1 w-10 rounded-full bg-red-500" />

          <p className="text-gray-400 leading-relaxed">
            {props.error || "The verification link is invalid or has expired."}
          </p>

          <Link
            to="/login"
            className="
              mt-10
              block
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
            Back to Login
          </Link>

          <Link
            to="/signup"
            className="
              mt-4
              block
              text-sm
              text-gray-500
              transition
              hover:text-red-400
            "
          >
            Create a New Account
          </Link>

          <p className="mt-8 text-xs text-gray-600">
            Try requesting a new verification email.
          </p>
        </div>
      </div>
    </div>
  );
}