import { Check, X, ShieldBan, ArrowLeft } from "lucide-react";
import { useChatStore } from "../store/chatStore.js";

const IncomingFriendRequestPage = ({ user }) => {
  const {
    handleRequest,
    requestLoading,
    setSelectedUser,
  } = useChatStore();

  const handleAccept = async () => {
    try {
      await handleRequest("accepted");
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleDecline = async () => {
    try {
      await handleRequest("declined");
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  const handleBlock = async () => {
    try {
      await handleRequest("blocked");
    } catch (error) {
      console.error("Error blocking friend request:", error);
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
        {/* Mobile Back Button (inside container) */}
        <button
          onClick={() => setSelectedUser(null)}
          className="
            md:hidden
            absolute
            top-6
            left-6
            z-30
            w-10
            h-10
            flex
            items-center
            justify-center
            rounded-full
            text-white
            hover:bg-white/5
            transition
          "
        >
          <ArrowLeft size={22} />
        </button>

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
            <Check size={16} />
            <span>Incoming friend request</span>
          </div>

          {/* Description */}
          <p className="mt-8 text-zinc-500 leading-8 text-lg max-w-md mx-auto">
            <span className="text-white font-semibold">
              {user?.name}
            </span>{" "}
            wants to become your friend and start chatting with you.
            Accept the request to unlock messaging, media sharing,
            voice calls and video calls.
          </p>

          {/* Buttons */}
          <div className="mt-12 flex flex-col md:flex-row gap-4">
            {/* Accept */}
            <button
              disabled={requestLoading}
              onClick={handleAccept}
              className="
                flex-1
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
              <Check size={22} />
              Accept
            </button>

            {/* Decline */}
            <button
              disabled={requestLoading}
              onClick={handleDecline}
              className="
                flex-1
                h-16
                rounded-2xl
                bg-zinc-800
                text-white
                font-semibold
                text-lg
                flex
                items-center
                justify-center
                gap-3
                transition-all
                duration-300
                hover:bg-zinc-700
                hover:scale-[1.02]
                active:scale-[0.98]
              "
            >
              <X size={22} />
              Decline
            </button>

            {/* Block */}
            <button
              disabled={requestLoading}
              onClick={handleBlock}
              className="
                flex-1
                h-16
                rounded-2xl
                bg-zinc-800
                text-white
                font-semibold
                text-lg
                flex
                items-center
                justify-center
                gap-3
                transition-all
                duration-300
                hover:bg-red-500/10
                hover:text-red-400
                hover:scale-[1.02]
                active:scale-[0.98]
              "
            >
              <ShieldBan size={22} />
              Block
            </button>
          </div>

          {/* Footer */}
          <p className="mt-8 text-sm text-zinc-600">
            Choose carefully. Blocking will prevent all future interactions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IncomingFriendRequestPage;