import { useAuthStore } from "../store/authStore";


export default function Dashboard() {
  const {logout,isLoading,user} = useAuthStore();

  const handleLogout = async()=>{
      try {
        await logout();
      } catch (error) {
        console.log(error);
      }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-red-500/20 blur-3xl" />

      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-red-500/20 blur-3xl" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6">
        <h1 className="text-2xl font-bold text-white">
          Auth<span className="text-red-500">System</span>
        </h1>

        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="
            rounded-xl
            border
            border-red-500/30
            px-6
            py-3
            font-semibold
            text-red-400
            transition
            hover:bg-red-500
            hover:text-white
          "
        >
          {!isLoading?"Logout":"wait..."}
        </button>
      </header>

      {/* Hero */}
      <div className="relative z-10 flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <p className="uppercase tracking-[0.4em] text-red-500 text-sm">
          Welcome Back
        </p>

        <h2 className="mt-4 text-5xl md:text-7xl font-black text-white">
          {user.name}
        </h2>

        <p className="mt-6 max-w-2xl text-lg text-gray-400">
          Your account is ready.
        </p>

        {/* Graphic */}
        <div className="relative mt-16">
          <div
            className="
              absolute
              inset-0
              rounded-full
              bg-red-500/20
              blur-3xl
              scale-125
            "
          />

          <div
            className="
              relative
              flex
              h-56
              w-56
              items-center
              justify-center
              rounded-full
              border
              border-red-500/40
              bg-[#161616]
              shadow-[0_0_80px_rgba(239,68,68,0.4)]
            "
          >
            <span className="text-[120px]">🔐</span>
          </div>
        </div>
      </div>
    </div>
  );
}