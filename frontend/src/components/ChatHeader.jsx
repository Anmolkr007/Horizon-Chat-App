import { Phone, Video, MoreVertical } from "lucide-react";
import {useAuthStore} from "../store/authStore.js";
const ChatHeader = ({ user }) => {
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers
    .map(Number)
    .includes(user?.id);
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
      <div className="flex items-center gap-5">
        <div className="relative">
          <img
            src={user?.profilepic_url}
            alt={user?.name}
            className="
              w-15 h-15
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
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        {[Phone, Video, MoreVertical].map((Icon, index) => (
          <button
            key={index}
            className="
              w-12 h-12
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
            <Icon size={20} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatHeader;