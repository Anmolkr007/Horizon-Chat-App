import {
  ArrowLeft,
  User,
  Mail,
  Info,
  Calendar,
  Circle,
} from "lucide-react";
import { useChatStore } from "../store/chatStore.js";
import { useAuthStore } from "../store/authStore.js";
import { useNavigate } from "react-router";

const SelectedUserProfile = () => {
  const { selectedUser: user } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const navigate = useNavigate();

  const isOnline = onlineUsers.map(Number).includes(user?.id);

  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="relative h-full flex items-center justify-center overflow-hidden bg-[#090909]">

      {/* Background Glow */}
      <div className="absolute -top-52 -left-52 w-[520px] h-[520px] rounded-full bg-red-500/10 blur-[180px]" />
      <div className="absolute -bottom-52 -right-52 w-[520px] h-[520px] rounded-full bg-red-600/10 blur-[180px]" />

      <div
        className="
          relative
          w-[540px]
          rounded-[34px]
          bg-[#111111]/95
          border
          border-white/5
          backdrop-blur-xl
          shadow-[0_25px_70px_rgba(0,0,0,0.75)]
          overflow-hidden
        "
      >
        {/* Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

        {/* Header */}
        <div className="flex items-center gap-4 px-7 py-5 border-b border-white/5">
          <button
            onClick={() => navigate(-1)}
            className="
              w-10
              h-10
              rounded-full
              bg-white/5
              flex
              items-center
              justify-center
              text-zinc-300
              transition-all
              duration-300
              hover:bg-red-500/15
              hover:text-red-400
            "
          >
            <ArrowLeft size={20} />
          </button>

          <h2 className="text-white text-xl font-semibold">
            Profile
          </h2>
        </div>

        <div className="px-8 pt-8 pb-8">

          {/* Avatar */}
          <div className="relative flex flex-col items-center">

            <div className="absolute w-44 h-44 rounded-full bg-red-500/10 blur-[90px]" />

            <div className="relative">

              <img
                src={user?.profilepic_url}
                alt={user?.name}
                className="
                  relative
                  w-28
                  h-28
                  rounded-full
                  object-cover
                  border-[4px]
                  border-[#1b1b1b]
                  shadow-[0_0_35px_rgba(239,68,68,0.25)]
                "
              />

              <div
                className={`
                  absolute
                  bottom-1
                  right-1
                  w-6
                  h-6
                  rounded-full
                  border-[3px]
                  border-[#111111]
                  ${
                    isOnline
                      ? "bg-green-500"
                      : "bg-red-500"
                  }
                `}
              />
            </div>

            <h1 className="mt-5 text-3xl font-bold text-white">
              {user?.name}
            </h1>

            <div
              className={`
                mt-3
                px-4
                py-2
                rounded-full
                flex
                items-center
                gap-2
                ${
                  isOnline
                    ? "bg-green-500/10 text-green-400"
                    : "bg-red-500/10 text-red-400"
                }
              `}
            >
              <Circle size={8} fill="currentColor" />
              <span className="text-sm font-medium">
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>

          </div>

          {/* About */}

          <div className="mt-8">

            <div className="flex items-center gap-2 text-red-400">
              <Info size={17} />
              <h3 className="font-semibold">
                About
              </h3>
            </div>

            <div
              className="
                mt-3
                rounded-2xl
                bg-[#171717]
                border
                border-white/5
                p-5
              "
            >
              <p className="text-zinc-300 leading-7 text-sm">
                {user?.bio?.trim()
                  ? user.bio
                  : "This user hasn't added a bio yet."}
              </p>
            </div>

          </div>
                    {/* Information */}

          <div className="mt-7">

            <div className="flex items-center gap-2 text-red-400">
              <User size={17} />
              <h3 className="font-semibold">
                Information
              </h3>
            </div>

            <div
              className="
                mt-3
                rounded-2xl
                overflow-hidden
                bg-[#171717]
                border
                border-white/5
              "
            >
              <InfoRow
                label="Name"
                value={user?.name}
              />

              {user?.email && (
                <InfoRow
                  label="Email"
                  value={user.email}
                  icon={<Mail size={15} />}
                />
              )}

              <InfoRow
                label="Status"
                value={isOnline ? "Online" : "Offline"}
                valueColor={
                  isOnline
                    ? "text-green-400"
                    : "text-red-400"
                }
              />

              {joinedDate && (
                <InfoRow
                  label="Joined"
                  value={joinedDate}
                  icon={<Calendar size={15} />}
                />
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

const InfoRow = ({
  label,
  value,
  icon,
  valueColor = "text-white",
}) => {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        px-5
        py-4
        border-b
        last:border-b-0
        border-white/5
      "
    >
      <div className="flex items-center gap-2 text-zinc-500 text-sm">
        {icon}
        <span>{label}</span>
      </div>

      <span
        className={`${valueColor} text-sm font-medium text-right max-w-[230px] break-all`}
      >
        {value}
      </span>
    </div>
  );
};

export default SelectedUserProfile;