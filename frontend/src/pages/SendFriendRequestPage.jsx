import { UserPlus, Shield } from "lucide-react";
import { useChatStore } from "../store/chatStore.js";
import {useNavigate} from "react-router"

const SendFriendRequestPage = ({ user }) => {
  const { sendFriendRequest, requestLoading } = useChatStore();
  const navigate = useNavigate();
  const handleClick = async () => {
    try {console.log("Sending friend request to user:", user);
      await sendFriendRequest();
    } catch (error) {
      console.error("Error sending friend request:", error);
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
          rounded-[42px]
          border border-white/5
          bg-[#121212]/95
          backdrop-blur-xl
          shadow-[0_30px_80px_rgba(0,0,0,0.85)]
          overflow-hidden
        "
      >
        {/* subtle top glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

        <div className="px-12 py-14 text-center">

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
                shadow-[0_0_60px_rgba(239,68,68,0.25)]
              "
            />
          </div>

          {/* Name */}
          <h1 className="mt-8 text-4xl font-bold text-white tracking-wide">
            {user?.name}
          </h1>

          {/* Status */}
          <div className="mt-4 flex items-center justify-center gap-2 text-zinc-400">
            <Shield size={16} />
            <span>Not connected yet</span>
          </div>

          {/* Description */}
          <p className="mt-8 text-zinc-500 leading-8 text-lg max-w-md mx-auto">
            Send a friend request to start chatting, share photos,
            videos, files and enjoy voice or video calls together.
          </p>

          {/* Button */}
          <button
            disabled={requestLoading}
            onClick={handleClick}
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
            <UserPlus size={22} />
            Send Friend Request
          </button>

          {/* Footer Text */}
          <p className="mt-8 text-sm text-zinc-600">
            Once accepted, messaging and calling features will become available.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SendFriendRequestPage;