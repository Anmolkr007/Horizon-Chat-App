import React, { useRef, useState, useEffect } from "react";
import { FileText, Download, Play, Pause, Volume2 } from "lucide-react";

/**
 * Small custom audio player to avoid native black chrome and keep consistent styling.
 */
const AudioPlayer = ({ src }) => {
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onLoaded = () => setDuration(a.duration || 0);
    const onTime = () => setCurrent(a.currentTime || 0);
    const onEnded = () => setPlaying(false);

    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnded);

    return () => {
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnded);
    };
  }, [src]);

  useEffect(() => {
    const a = audioRef.current;
    if (a) a.volume = volume;
  }, [volume]);

  const togglePlay = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      try {
        await a.play();
        setPlaying(true);
      } catch {
        // play blocked or error
      }
    }
  };

  const seek = (e) => {
    const a = audioRef.current;
    if (!a || !progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    a.currentTime = x * duration;
    setCurrent(a.currentTime);
  };

  const format = (s = 0) => {
    const mm = Math.floor(s / 60).toString();
    const ss = Math.floor(s % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  return (
    <div className="w-full max-w-[300px]">
      <audio ref={audioRef} src={src} preload="metadata" />

      <div
        className="flex items-center gap-3 p-2 rounded-lg bg-white/6 border border-white/6 shadow-sm"
        role="group"
        aria-label="audio player"
      >
        <button
          onClick={togglePlay}
          className="w-9 h-9 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition"
          aria-pressed={playing}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause size={14} className="text-white" /> : <Play size={14} className="text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          <div
            ref={progressRef}
            onClick={seek}
            className="relative h-2 bg-white/10 rounded-full cursor-pointer"
            role="slider"
            aria-valuemin={0}
            aria-valuemax={duration || 0}
            aria-valuenow={current || 0}
          >
            <div
              className="absolute left-0 top-0 bottom-0 bg-red-500 rounded-full"
              style={{ width: `${duration ? (current / duration) * 100 : 0}%` }}
            />
            <div
              className="absolute -translate-y-1/2 top-1/2 left-0 w-2.5 h-2.5 rounded-full bg-white shadow"
              style={{
                left: `${duration ? (current / duration) * 100 : 0}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>

          <div className="mt-1 flex items-center justify-between text-xs text-zinc-300">
            <span>{format(current)}</span>
            <span>{format(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Volume2 size={14} className="text-zinc-300" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-20 accent-red-500"
            aria-label="volume"
          />
        </div>
      </div>
    </div>
  );
};

/**
 * MessageBubble - compact, polished, and prevents content clipping.
 */
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
            className="relative text-sm leading-6 break-words text-white"
            style={{ wordBreak: "break-word" }}
          >
            {message.message}
          </p>
        );

      case "image":
  return (
    <img
      src={message.message}
      alt={message.alt || "uploaded image"}
      className="
        max-w-[300px]
        w-auto
        rounded-xl
        object-cover
        cursor-pointer
        transition-transform
        duration-200
        hover:scale-105
      "
      loading="lazy"
      style={{ display: "block" }}
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
        } catch (error) {
          console.error("Download failed:", error);
        }
      }}
    />
  );

      case "video":
        return (
          <video
            controls
            className="max-w-[300px] w-full rounded-xl overflow-hidden"
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
            className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/10 hover:border-red-500/30 transition duration-200 max-w-[320px]"
          >
            <div className="w-12 h-12 rounded-lg bg-red-500/15 flex items-center justify-center flex-shrink-0">
              <FileText size={22} className="text-red-400" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">PDF Document</p>
              <p className="text-zinc-500 text-sm truncate">Click to open</p>
            </div>

            <Download size={18} className="text-zinc-400 flex-shrink-0" />
          </a>
        );

      case "file":
        return (
          <a
            href={message.message}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/10 hover:border-red-500/30 transition duration-200 max-w-[360px]"
          >
            <div className="w-12 h-12 rounded-lg bg-red-500/15 flex items-center justify-center flex-shrink-0">
              <FileText size={22} className="text-red-400" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">File</p>
              <p className="text-zinc-500 text-sm truncate">Click to open or download</p>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                const link = document.createElement("a");
                link.href = message.message;
                link.download = "";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-red-500 transition flex items-center justify-center flex-shrink-0"
              aria-label="download file"
            >
              <Download size={16} className="text-white" />
            </button>
          </a>
        );

      default:
        return (
          <div className="p-3 rounded-xl bg-black/20 border border-white/10 max-w-[300px]">
            <p className="text-xs text-zinc-500">Unsupported file type</p>
          </div>
        );
    }
  };

  // small SVG tail that flips left/right
  const BubbleTail = ({ right }) => (
    <svg
      width="16"
      height="12"
      viewBox="0 0 16 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute bottom-0 ${right ? "right-[-6px]" : "left-[-6px]"}`}
      aria-hidden="true"
    >
      <path
        d={right ? "M0 0 L16 0 L8 12 Z" : "M16 0 L0 0 L8 12 Z"}
        fill={own ? "url(#g)" : "rgba(255,255,255,0.04)"}
      />
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0.95" />
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <div className={`flex mb-3 ${own ? "justify-end" : "justify-start"} px-2`}>
      <div
        className={`
          relative
          max-w-[66%]
          px-3
          py-2
          transition-transform
          duration-200
          hover:scale-[1.01]
        `}
      >
        <div className={`relative overflow-visible ${own ? "ml-4" : "mr-4"} ${own ? "text-right" : "text-left"}`}>
          <div
            className={`
              inline-block
              align-bottom
              px-3
              py-2
              rounded-xl
              ${own ? "rounded-br-md" : "rounded-bl-md"}
              ${own ? "bg-gradient-to-br from-red-500 to-red-600" : "bg-white/[0.03]"}
              ${own ? "shadow-[0_6px_24px_rgba(239,68,68,0.18)]" : "shadow-[0_6px_18px_rgba(0,0,0,0.35)]"}
              border
              ${own ? "border-transparent" : "border-white/6"}
            `}
            role="article"
            aria-label={own ? "your message" : "incoming message"}
          >
            {own && (
              <div className="absolute inset-0 rounded-xl pointer-events-none bg-gradient-to-b from-white/6 to-transparent" aria-hidden="true" />
            )}

            <div className="relative z-10 min-w-0">{renderMessageContent()}</div>

            <div className={`mt-2 flex items-center justify-end gap-2 text-[11px] ${own ? "text-red-100/80" : "text-zinc-400"}`}>
              <span className="select-none">{time}</span>
              {own && <span className="text-xs select-none">{message.is_read ? "✓✓" : "✓"}</span>}
            </div>
          </div>

          {/* <BubbleTail right={own} /> */}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
