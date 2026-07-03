import { Ban } from "lucide-react";

const BlockedByUserPage = ({ user }) => {
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
                grayscale
                opacity-80
                shadow-[0_0_60px_rgba(239,68,68,0.15)]
              "
            />
          </div>

          {/* Name */}
          <h1 className="mt-8 text-4xl font-bold text-white tracking-wide">
            {user?.name}
          </h1>

          {/* Status */}
          <div className="mt-4 flex items-center justify-center gap-2 text-red-400">
            <Ban size={16} />
            <span>You have been blocked</span>
          </div>

          {/* Description */}
          <p className="mt-8 text-zinc-500 leading-8 text-lg max-w-md mx-auto">
            This user has blocked you. You can no longer send messages,
            share media, make voice calls, or start video calls with them.
          </p>

          {/* Disabled Action */}
          <button
            disabled
            className="
              mt-12
              w-full
              h-16
              rounded-2xl
              bg-zinc-900
              text-zinc-500
              font-semibold
              text-lg
              cursor-not-allowed
              border border-white/5
            "
          >
            Interaction Unavailable
          </button>

          {/* Footer */}
          <p className="mt-8 text-sm text-zinc-600">
            If this was a mistake, the user must unblock you before communication can resume.
          </p>

        </div>
      </div>
    </div>
  );
};

export default BlockedByUserPage;