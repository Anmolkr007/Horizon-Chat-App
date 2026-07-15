import { Lock, Unlock, ArrowLeft } from "lucide-react";
import { useChatStore } from "../store/chatStore.js";

const BlockedUserPage = ({ user }) => {
  const {
    handleRequest,
    requestLoading,
    setSelectedUser,
    selectedUser,
    getUserById
  } = useChatStore();

  const handleUnblock = async () => {
    try {
      await handleRequest("unblocked");
      await getUserById(selectedUser.id,selectedUser.profilepic_url,selectedUser.name);
    } catch (error) {
      console.error("Error unblocking user:", error);
    }
  };

  return (
    <div className="relative h-full flex items-center justify-center overflow-hidden bg-[#090909]">

      {/* Background Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[180px]" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[180px]" />

      <div
        className="
          relative
          w-[580px]
          max-w-[92vw]
          rounded-[42px]
          border border-white/5
          bg-[#121212]/95
          backdrop-blur-xl
          shadow-[0_30px_80px_rgba(0,0,0,0.85)]
          overflow-hidden
        "
      >
        {/* Mobile Back Button */}
        <div className="md:hidden absolute top-6 left-6 z-30">
          <ArrowLeft
            onClick={() => setSelectedUser(null)}
            className="
              w-7
              h-7
              text-white
              cursor-pointer
              transition
              hover:text-red-400
            "
          />
        </div>

        {/* subtle top glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

        <div className="px-12 pt-16 pb-14 text-center">

          {/* Avatar */}
          <div className="relative flex justify-center">
            <div className="absolute w-48 h-48 bg-red-500/15 rounded-full blur-[90px]" />

            <img
              src={user?.profilepic_url}
              alt={user?.name}
              className="
                relative
                w-36
                h-36
                rounded-full
                object-cover
                border-4
                border-zinc-800
                grayscale
                shadow-[0_0_60px_rgba(239,68,68,0.20)]
              "
            />
          </div>

          {/* Name */}
          <h1 className="mt-8 text-4xl font-bold text-white tracking-wide">
            {user?.name}
          </h1>

          {/* Status */}
          <div className="mt-4 flex items-center justify-center gap-2 text-red-400">
            <Lock size={16} />
            <span>User blocked</span>
          </div>

          {/* Description */}
          <p className="mt-8 text-zinc-500 leading-8 text-lg max-w-md mx-auto">
            You blocked{" "}
            <span className="text-white font-semibold">
              {user?.name}
            </span>
            . Messages, media sharing, voice calls and video calls are currently
            disabled.
          </p>

          {/* Button */}
          <button
            disabled={requestLoading}
            onClick={handleUnblock}
            className="
              mt-12
              w-full
              h-16
              rounded-2xl
              bg-red-500
              text-white
              font-semibold
              text-lg
              flex
              items-center
              justify-center
              gap-3
              transition-all
              duration-300
              hover:bg-red-600
              hover:shadow-[0_0_40px_rgba(239,68,68,0.45)]
              hover:scale-[1.02]
              active:scale-[0.98]
            "
          >
            <Unlock size={22} />
            Unblock User
          </button>

          {/* Footer */}
          <p className="mt-8 text-sm text-zinc-600">
            Unblocking will restore the ability to interact with this user.
          </p>

        </div>
      </div>
    </div>
  );
};

export default BlockedUserPage;