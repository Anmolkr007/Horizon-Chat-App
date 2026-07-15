import { ArrowLeft, Video, MoreVertical, Ban } from "lucide-react";
import { useAuthStore } from "../store/authStore.js";
import { useChatStore } from "../store/chatStore.js";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";

const ChatHeader = ({ user }) => {
  const { onlineUsers } = useAuthStore();
  const {
    setSelectedUser,
    handleRequest,
    requestLoading,
    isTyping,
  } = useChatStore();

  const navigate = useNavigate();

  const isOnline = onlineUsers.map(Number).includes(user?.id);

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleBlock = async () => {
    setShowMenu(false);

    try {
      await handleRequest("blocked");
    } catch (error) {
      console.log("error in blocking:", error);
    }
  };

  return (
    <header
      className="
        h-20
        md:h-24
        px-4
        md:px-8
        border-b border-white/5
        bg-black/40
        backdrop-blur-xl
        flex
        items-center
        justify-between
        relative
        z-20
      "
    >
      {/* Left Side */}
      <div className="flex items-center flex-1 min-w-0">
        <ArrowLeft
          onClick={() => setSelectedUser(null)}
          className="md:hidden mr-3 shrink-0 cursor-pointer"
        />

        <div
          className="flex items-center gap-3 cursor-pointer min-w-0"
          onClick={() => navigate("/SelectedUserProfile")}
        >
          <div className="relative shrink-0">
            <img
              src={user?.profilepic_url}
              alt={user?.name}
              className="
                w-12
                h-12
                md:w-15
                md:h-15
                rounded-full
                object-cover
                border
                border-red-500/20
              "
            />

            <div
              className={`
                absolute
                bottom-0
                right-0
                w-3
                h-3
                md:w-4
                md:h-4
                rounded-full
                border-2
                border-black
                ${isOnline ? "bg-green-500" : "bg-red-500"}
              `}
            />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg md:text-xl font-semibold truncate">
              {user?.name}
            </h2>

            <p className="text-zinc-500 text-sm truncate">
              {isTyping
                ? "Typing..."
                : isOnline
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div
        ref={menuRef}
        className="flex items-center gap-2 md:gap-3 relative shrink-0"
      >
        <button
          className="
            w-11
            h-11
            md:w-12
            md:h-12
            rounded-full
            bg-white/[0.03]
            border border-white/5
            flex
            items-center
            justify-center
            text-zinc-400
            transition-all
            duration-300
            hover:text-white
            hover:bg-red-500/10
            hover:border-red-500/20
            hover:shadow-[0_0_25px_rgba(239,68,68,0.25)]
          "
        >
          <Video size={20} />
        </button>

        <button
          onClick={() => setShowMenu((prev) => !prev)}
          className="
            w-11
            h-11
            md:w-12
            md:h-12
            rounded-full
            bg-white/[0.03]
            border border-white/5
            flex
            items-center
            justify-center
            text-zinc-400
            transition-all
            duration-300
            hover:text-white
            hover:bg-red-500/10
            hover:border-red-500/20
            hover:shadow-[0_0_25px_rgba(239,68,68,0.25)]
          "
        >
          <MoreVertical size={20} />
        </button>

        {showMenu && (
          <div
            className="
              absolute
              right-0
              top-14
              md:top-16
              w-48
              rounded-xl
              overflow-hidden
              border border-white/10
              bg-zinc-900/95
              backdrop-blur-xl
              shadow-2xl
            "
          >
            <button
              disabled={requestLoading}
              onClick={handleBlock}
              className="
                w-full
                px-4
                py-3
                flex
                items-center
                gap-3
                text-red-400
                hover:bg-red-500/10
                transition-colors
              "
            >
              <Ban size={18} />
              <span>Block User</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default ChatHeader;