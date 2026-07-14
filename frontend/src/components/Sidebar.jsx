import { Search, Pencil, UserSearch } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore.js";
import { useChatStore } from "../store/chatStore.js";
import UserCard from "./UserCard.jsx";
import { all } from "axios";
import { useNavigate } from "react-router";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user ,onlineUsers} = useAuthStore();
  const [filter, setFilter] = useState("all");
  const [userSearch, setUserSearch] = useState("");
  console.log(userSearch);
  console.log("onlineUsers in sidebar:", onlineUsers);
  
  
  const {
    getAllUsers,
    getAllFriends,
    allUser,
    allFriend,
    displayUser,
    displayFriend,
    isUserLoading,
    error,
    setSearchedUser
  } = useChatStore();

  const handleSubmit = (e)=>{
    console.log("i am in handle submit");
    
    e.preventDefault();
    if(filter === "all"){
        const matches = allUser.filter(user => user.name.toLowerCase().includes(userSearch.toLowerCase()));
        setSearchedUser(matches,filter);
    }
    else{//filter is friends
        const matches = allFriend.filter(user => user.name.toLowerCase().includes(userSearch.toLowerCase()));
        setSearchedUser(matches,filter);
    }
    setUserSearch("");

  }

  

  useEffect(() => {
    const func = async()=>{
        try {
            filter === "all" ? await getAllUsers() :
            await getAllFriends();
        } catch (error) {
            console.log(error);
        }
    };func();
  }, [filter]);

  const onlineUserSet = new Set(
  onlineUsers.map(Number)
);

const usersToRender =
  filter === "all" ? displayUser : displayFriend;

const sortedUsers = [...usersToRender].sort((a, b) => {
  const aOnline = onlineUserSet.has(a.id);
  const bOnline = onlineUserSet.has(b.id);

  if (aOnline === bOnline) return 0;

  return aOnline ? -1 : 1;
});

  return (
    <aside
      className="
        w-95
        min-w-95
        h-screen
        bg-[#0b0b0b]
        border-r border-white/5
        flex flex-col
        relative
        overflow-hidden
      "
    >
      {/* Ambient background glow */}
      <div className="absolute -top-32 -left-20 w-80 h-80 bg-red-500/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Profile Section */}
      <div className="relative p-5">
        <div
          className="
            relative
            rounded-4xl
            bg-linear-to-br
            from-[#181818]
            to-[#101010]
            p-5
            border border-white/5
            shadow-[0_20px_40px_rgba(0,0,0,0.5)]
            overflow-hidden
          "
        >
          {/* Profile glow */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-red-500/20 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={user?.profilepic_url}
                  alt=""
                  className="
                    w-16
                    h-16
                    rounded-full
                    object-cover
                    border-2 border-red-500/20
                  "
                />

                <div
                  className="
                    absolute
                    bottom-1
                    right-1
                    w-3
                    h-3
                    bg-green-500
                    rounded-full
                    border-2 border-[#181818]
                  "
                />
              </div>

              <div>
                <h2 className="text-white text-xl font-semibold">
                  {user?.name}
                </h2>

                <p className="text-zinc-400 text-sm">
                  Welcome back
                </p>
              </div>
            </div>

            <button
            onClick={()=>navigate("/userProfile")}
              className="
                w-12
                h-12
                rounded-full
                bg-white/5
                flex
                items-center
                justify-center
                transition-all
                duration-300
                hover:bg-red-500/10
                hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]
              "
            >
              <Pencil size={18} className="text-red-400" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mt-6">
            <Search
              size={20}
              className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                text-zinc-500
              "
            />
            <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Search users..."
              value={userSearch}
              onChange={(e)=>
                setUserSearch(e.target.value)
              }
              className="
                w-full
                h-14
                rounded-full
                bg-[#141414]
                pl-14
                pr-5
                text-white
                placeholder:text-zinc-500
                outline-none
                border border-white/5
                focus:border-red-500/30
                focus:shadow-[0_0_20px_rgba(239,68,68,0.15)]
                transition-all
              "
            />
            </form>
          </div>

          {/* Filter */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={() => setFilter("all")}
              className={`
                px-5 py-2 rounded-full text-sm transition-all duration-300
                ${
                  filter === "all"
                    ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                    : "bg-[#1a1a1a] text-zinc-400 hover:text-white"
                }
              `}
            >
              All
            </button>

            <button
              onClick={() => setFilter("friends")}
              className={`
                px-5 py-2 rounded-full text-sm transition-all duration-300
                ${
                  filter === "friends"
                    ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                    : "bg-[#1a1a1a] text-zinc-400 hover:text-white"
                }
              `}
            >
              Friends
            </button>
          </div>
        </div>
      </div>

      {/* User List */}
      <div
        className="
          flex-1
          overflow-y-auto
          px-3
          pb-5
          no-scrollbar
        "
      >
        {isUserLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-5">
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full scale-150" />

              {/* Spinner */}
              <div
                className="
                  relative
                  w-14
                  h-14
                  rounded-full
                  border-4
                  border-zinc-800
                  border-t-red-500
                  animate-spin
                "
              />
            </div>

            <p className="text-zinc-400 text-sm tracking-wide">
              Loading users...
            </p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-400">
              Failed to load users
            </p>
          </div>
        ) : (
          sortedUsers.map((user) => (
      <UserCard
      key={user.id}
      user={user}
      online={onlineUserSet.has(user.id)}
      />
      ))
        )}
      </div>
    </aside>
  );
};

export default Sidebar;