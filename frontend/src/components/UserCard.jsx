import { useChatStore } from "../store/chatStore.js";


const UserCard = ({user,online}) => {
  const {getUserById,notifications,clearNotifications} = useChatStore();
  const unreadCount = notifications[user.id] || 0;
  const handleClick = async()=>{
    try {
      clearNotifications(user.id);
      await getUserById(user.id,user.profilepic_url,user.name)
    } catch (error) {
      console.log(error);
      
    }
  }
  return (
    <div onClick={handleClick}
      className="
      group
      relative
      overflow-hidden
      rounded-[28px]
      px-4
      py-4
      cursor-pointer
      transition-all
      duration-300
      hover:bg-[#171717]
    "
    >
      {/* red flame effect */}
      <div
        className="
        absolute
        inset-0
        opacity-0
        group-hover:opacity-100
        transition-all
        duration-500
        bg-[radial-gradient(circle_at_left_center,rgba(239,68,68,0.25),transparent_65%)]
        pointer-events-none
      "
      />

      <div className="relative flex items-center gap-4">
        <div className="relative">
          <img
            src={user.profilepic_url}
            alt=""
            className="
            w-14
            h-14
            rounded-full
            object-cover
          "
          />

          <div
            className={`
              absolute
              bottom-0
              right-0
              w-3
              h-3
              rounded-full
              border-2
              border-[#0b0b0b]
              ${online ? "bg-green-500" : "bg-red-500"}
            `}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h3
              className="
              text-white
              font-semibold
              text-lg
              group-hover:text-red-400
              transition-colors
            "
            >
              {user.name}
            </h3>

            
          </div>

          <div className="flex justify-between items-center mt-1">
            <p
  className={`
    truncate
    text-sm
    font-medium
    ${unreadCount > 0 ? "text-red-400 animate-pulse" : "text-zinc-500"}
  `}
>
  {unreadCount > 0 ? "New Message" : ""}
</p>

            {unreadCount > 0 && <div
              className="
              w-5
              h-5
              rounded-full
              bg-red-500
              text-white
              text-xs
              flex
              items-center
              justify-center
              shadow-[0_0_10px_rgba(239,68,68,0.5)]
            "
            >
              {unreadCount > 0 ? unreadCount : ""}
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;