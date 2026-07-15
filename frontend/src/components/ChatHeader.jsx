import { ArrowLeft,Video, MoreVertical, Ban } from "lucide-react";
import { useAuthStore } from "../store/authStore.js";
import { useChatStore } from "../store/chatStore.js";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";

const ChatHeader = ({ user }) => {
  const { onlineUsers } = useAuthStore();
  const {selectedUser,handleRequest,requestLoading,isTyping} = useChatStore()
  const navigate = useNavigate();

  const isOnline = onlineUsers
    .map(Number)
    .includes(user?.id);

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

  const handleBlock = async() => {
    setShowMenu(false);
    try{
      await handleRequest("blocked")
    }
    catch(error){
      console.log("error in blocking in chat header:",error);
    }
  };

  return (
    <div
      className="
        h-24
        px-8
        border-b border-white/5
        bg-black/40
        backdrop-blur-xl
        flex items-center justify-between
        relative
        z-20
      "
    >
      <ArrowLeft
    className="md:hidden cursor-pointer"
    onClick={() => setSelectedUser(null)}
    />
      <div className="flex items-center gap-5">
        <div className="relative" onClick={()=>navigate("/SelectedUserProfile")}>
          <img
            src={user?.profilepic_url}
            alt={user?.name}
            className="
              w-15
              h-15
              rounded-full
              object-cover
              border border-red-500/20
            "
          />

          <div
            className={`
              absolute
              bottom-0
              right-0
              w-4
              h-4
              rounded-full
              border-2
              border-black
              ${isOnline ? "bg-green-500" : "bg-red-500"}
            `}
          />
        </div>

        <div>
          <h2 className="text-white text-xl font-semibold">
            {user?.name}
          </h2>

          <p className="text-zinc-500 text-sm">
          {isTyping ? "Typing..." : isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex gap-3 relative" ref={menuRef}>
        <button
          className="
            w-12
            h-12
            rounded-full
            bg-white/[0.03]
            border border-white/5
            flex items-center justify-center
            text-zinc-400
            transition-all duration-300
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
            w-12
            h-12
            rounded-full
            bg-white/[0.03]
            border border-white/5
            flex items-center justify-center
            text-zinc-400
            transition-all duration-300
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
              top-16
              w-48
              rounded-xl
              overflow-hidden
              border border-white/10
              bg-zinc-900/95
              backdrop-blur-xl
              shadow-2xl
              animate-in fade-in zoom-in duration-150
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
    </div>
  );
};

export default ChatHeader;