const EmptyConversationPage = () => {
  return (
    <div className="relative h-full flex items-center justify-center overflow-hidden bg-[#070707]">

      {/* Background Glow */}
      <div className="absolute -top-37.5 -left-37.5 w-100 h-100 bg-red-500/10 blur-[180px] rounded-full" />

      <div className="absolute -bottom-37.5 -right-37.5 w-100 h-100 bg-red-500/10 blur-[180px] rounded-full" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center">

        {/* Icon Container */}
        <div
          className="
            w-40
            h-40
            rounded-full
            bg-linear-to-br
            from-red-500/20
            to-red-700/5
            border border-red-500/20
            flex
            items-center
            justify-center
            shadow-[0_0_80px_rgba(239,68,68,0.25)]
          "
        >
          <div
            className="
              text-7xl
              drop-shadow-[0_0_25px_rgba(239,68,68,0.7)]
            "
          >
            💬
          </div>
        </div>

        {/* Heading */}
        <h1 className="mt-10 text-5xl font-bold text-white tracking-wide">
          Start a Conversation
        </h1>

        {/* Description */}
        <p className="mt-5 max-w-lg text-zinc-400 text-lg leading-relaxed">
          Select a user from the sidebar and begin chatting instantly.
          Messages, images, files and calls will appear here.
        </p>

        {/* Decorative line */}
        <div className="mt-10 w-40 h-0.5 bg-linear-to-r from-transparent via-red-500 to-transparent opacity-70" />

      </div>
    </div>
  );
};

export default EmptyConversationPage;