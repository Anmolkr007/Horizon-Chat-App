import React, { useRef, useState, useEffect } from "react";
import {
  FileText,
  Download,
  Play,
  Pause,
  Volume2,
  LoaderCircle
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                Audio Player                                */
/* -------------------------------------------------------------------------- */

const AudioPlayer = ({ src }) => {
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const loaded = () => setDuration(audio.duration || 0);
    const time = () => setCurrent(audio.currentTime || 0);
    const ended = () => setPlaying(false);

    audio.addEventListener("loadedmetadata", loaded);
    audio.addEventListener("timeupdate", time);
    audio.addEventListener("ended", ended);

    return () => {
      audio.removeEventListener("loadedmetadata", loaded);
      audio.removeEventListener("timeupdate", time);
      audio.removeEventListener("ended", ended);
    };
  }, [src]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        await audio.play();
        setPlaying(true);
      } catch {}
    }
  };

  const seek = (e) => {
    if (!audioRef.current || !progressRef.current || !duration) return;

    const rect = progressRef.current.getBoundingClientRect();

    const percent = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width)
    );

    audioRef.current.currentTime = percent * duration;
  };

  const format = (sec = 0) =>
    `${Math.floor(sec / 60)}:${Math.floor(sec % 60)
      .toString()
      .padStart(2, "0")}`;

  return (
    <div className="w-full max-w-[300px]">
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2">

        <button
          onClick={togglePlay}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500 transition hover:bg-red-600"
        >
          {playing ? (
            <Pause size={14} className="text-white" />
          ) : (
            <Play size={14} className="text-white" />
          )}
        </button>

        <div className="flex-1">

          <div
            ref={progressRef}
            onClick={seek}
            className="relative h-2 cursor-pointer rounded-full bg-white/10"
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-red-500"
              style={{
                width: `${
                  duration
                    ? (current / duration) * 100
                    : 0
                }%`,
              }}
            />

            <div
              className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-white"
              style={{
                left: `${
                  duration
                    ? (current / duration) * 100
                    : 0
                }%`,
                transform: "translate(-50%,-50%)",
              }}
            />
          </div>

          <div className="mt-1 flex justify-between text-xs text-zinc-400">
            <span>{format(current)}</span>
            <span>{format(duration)}</span>
          </div>

        </div>

        <div className="flex items-center gap-2">

          <Volume2 size={15} className="text-zinc-300" />

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) =>
              setVolume(Number(e.target.value))
            }
            className="w-20 accent-red-500"
          />

        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              Message Bubble                                */
/* -------------------------------------------------------------------------- */

const MessageBubble = ({ message, own }) => {
  const time = new Date(message.created_at).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  const renderMessageContent = () => {
        switch (message.message_type) {

      case "text":
        return (
          <p
            className="
              text-sm
              leading-6
              text-white
              whitespace-pre-wrap
              break-words
              break-all
              max-w-full
            "
          >
            {message.message}
          </p>
        );

      case "image":
        return (
          <img
            src={message.message}
            alt={message.alt || "uploaded image"}
            loading="lazy"
            className="
              block
              max-w-full
              md:max-w-[320px]
              rounded-xl
              object-cover
              cursor-pointer
              transition-transform
              duration-200
              hover:scale-[1.02]
            "
            onClick={async () => {
              try {
                const response = await fetch(message.message);
                const blob = await response.blob();

                const url = window.URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = url;
                link.download = `image-${Date.now()}.jpg`;

                document.body.appendChild(link);
                link.click();
                link.remove();

                window.URL.revokeObjectURL(url);
              } catch (err) {
                console.error(err);
              }
            }}
          />
        );

      case "video":
        return (
          <video
            controls
            className="
              block
              w-full
              max-w-[320px]
              rounded-xl
              overflow-hidden
            "
          >
            <source src={message.message} />
          </video>
        );

      case "audio":
        return <AudioPlayer src={message.message} />;

      case "pdf":
        return (
          <a
            href={message.message}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-white/10
              bg-black/20
              p-3
              transition
              hover:border-red-500/30
              max-w-[320px]
            "
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/15">
              <FileText size={22} className="text-red-400" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-white">
                PDF Document
              </p>
              <p className="truncate text-sm text-zinc-500">
                Click to open
              </p>
            </div>

            <Download
              size={18}
              className="text-zinc-400"
            />
          </a>
        );

      case "file":
        return (
          <a
            href={message.message}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-white/10
              bg-black/20
              p-3
              transition
              hover:border-red-500/30
              max-w-[360px]
            "
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/15">
              <FileText size={22} className="text-red-400" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-white">
                File
              </p>

              <p className="truncate text-sm text-zinc-500">
                Click to open or download
              </p>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();

                const link =
                  document.createElement("a");

                link.href = message.message;
                link.download = "";

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-white/5
                transition
                hover:bg-red-500
              "
            >
              <Download
                size={16}
                className="text-white"
              />
            </button>
          </a>
        );

      default:
        return (
          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <p className="text-xs text-zinc-500">
              Unsupported file type
            </p>
          </div>
        );
    }
  };
    return (
    <div
      className={`flex w-full mb-3 ${
        own ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`
          w-fit
          max-w-[85%]
          sm:max-w-[78%]
          md:max-w-[65%]
        `}
      >
        <div
          className={`
            relative
            rounded-2xl
            px-3
            py-2
            border
            overflow-hidden

            ${
              own
                ? `
                  bg-gradient-to-br
                  from-red-500
                  to-red-600
                  border-transparent
                  rounded-br-md
                  shadow-[0_6px_24px_rgba(239,68,68,0.18)]
                `
                : `
                  bg-white/[0.03]
                  border-white/10
                  rounded-bl-md
                  shadow-[0_6px_18px_rgba(0,0,0,0.35)]
                `
            }
          `}
        >
          {own && (
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          )}

          <div className="relative z-10">
            {renderMessageContent()}
          </div>

          <div
            className={`
              mt-2
              flex
              items-center
              justify-end
              gap-2
              text-[11px]

              ${
                own
                  ? "text-red-100/80"
                  : "text-zinc-400"
              }
            `}
          >
            <span>{time}</span>

            {own && (
  <span className="flex items-center justify-center w-4 h-4">
    {message.isSending ? (
      <LoaderCircle
        size={14}
        className="animate-spin text-white/70"
      />
    ) : (
      <span>
        {message.is_read ? "✓✓" : "✓"}
      </span>
    )}
  </span>
)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;