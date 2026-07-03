export default function Verifying() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-[#161616] shadow-2xl">
        <div className="h-1 bg-red-500" />

        <div className="p-10 text-center">
          {/* Spinner */}
          <div className="mx-auto h-20 w-20 rounded-full border-4 border-red-500/20 border-t-red-500 animate-spin" />

          <h1 className="mt-8 text-3xl font-bold text-white">
            Verifying Email
          </h1>

          <div className="mx-auto mt-2 mb-5 h-1 w-10 rounded-full bg-red-500" />

          <p className="text-gray-400 leading-relaxed">
            Please wait while we verify your email address.
            This will only take a few seconds.
          </p>

          <p className="mt-8 text-xs text-gray-600">
            Do not close this window.
          </p>
        </div>
      </div>
    </div>
  );
}