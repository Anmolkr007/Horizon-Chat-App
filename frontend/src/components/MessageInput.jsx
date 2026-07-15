import {
  Paperclip,
  Send,
  X,
  Video,
  Music,
  FileText,
  Mic,
  Square,
} from "lucide-react";

import { useState, useRef, useEffect } from "react";
import { useChatStore } from "../store/chatStore.js";
import { useAuthStore } from "../store/authStore.js";
const MAX_MESSAGE_LENGTH = 1000;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_RECORDING_TIME = 10 * 60; // 10 minutes

const MessageInput = () => {
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const fileInputRef = useRef(null);

  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const {
    sendMessage,
    isUploading,
    selectedUser,
  } = useChatStore();
  const {socket} = useAuthStore();
 const typingTimeout = useRef(null);

  const handleChange = (e) => {

    setText(e.target.value);

    socket.emit("typing", {
        receiverId: selectedUser.id,
    });

    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {

        socket.emit("stopTyping", {
            receiverId: selectedUser.id,
        });

    }, 1000);

};

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);

      if (mediaStreamRef.current) {
        mediaStreamRef.current
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  const stopMediaTracks = () => {
    if (!mediaStreamRef.current) return;

    mediaStreamRef.current
      .getTracks()
      .forEach((track) => track.stop());

    mediaStreamRef.current = null;
  };

  const startRecording = async () => {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      mediaStreamRef.current = stream;

      const recorder = new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        clearInterval(timerRef.current);

        const blob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        const file = new File(
          [blob],
          `voice-${Date.now()}.webm`,
          {
            type: "audio/webm",
          }
        );

        stopMediaTracks();

        setIsRecording(false);
        setRecordingTime(0);

        if (file.size > MAX_FILE_SIZE) {
          alert(
            "Recording exceeded the maximum size of 10MB."
          );
          return;
        }

        setSelectedFile(file);
      };

      recorder.start();

      setRecordingTime(0);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev + 1 >= MAX_RECORDING_TIME) {
            stopRecording();
            return MAX_RECORDING_TIME;
          }

          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.log(error);
      alert("Unable to access microphone.");
    }
  };

  const stopRecording = () => {
    clearInterval(timerRef.current);

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const formatTime = () => {
    const minutes = Math.floor(recordingTime / 60);
    const seconds = recordingTime % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("Maximum file size is 10MB.");
      return;
    }

    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
    const handleSend = async () => {
    if (!text.trim() && !selectedFile) return;

    const formData = new FormData();

    if (selectedFile) {
      formData.append("file", selectedFile);
    } else {
      formData.append("message", text.trim());
    }

    try {
      await sendMessage(formData, selectedUser.id);

      setText("");
      setSelectedFile(null);
      setRecordingTime(0);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderPreview = () => {
    if (!selectedFile) return null;

    if (selectedFile.type.startsWith("image/")) {
      return (
        <img
          src={URL.createObjectURL(selectedFile)}
          alt=""
          className="w-12 h-12 rounded-xl object-cover"
        />
      );
    }

    if (selectedFile.type.startsWith("video/")) {
      return (
        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
          <Video
            size={22}
            className="text-red-400"
          />
        </div>
      );
    }

    if (selectedFile.type.startsWith("audio/")) {
      return (
        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
          <Music
            size={22}
            className="text-red-400"
          />
        </div>
      );
    }

    return (
      <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
        <FileText
          size={22}
          className="text-red-400"
        />
      </div>
    );
  };

  return (
    <div className="px-6 pb-6 pt-4 relative z-20">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="
          h-18
          rounded-full
          border border-white/5
          bg-[#111111]/95
          backdrop-blur-xl
          px-3
          flex
          items-center
          shadow-[0_10px_40px_rgba(0,0,0,0.45)]
        "
      >
        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept="image/*,video/*,audio/*,.pdf"
          onChange={handleFileSelect}
        />

        {!selectedFile ? (
          <>
            {!isRecording && (
              <button
                type="button"
                disabled={isUploading}
                onClick={() =>
                  fileInputRef.current.click()
                }
                className="
                  w-12
                  h-12
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-zinc-400
                  hover:bg-red-500/10
                  hover:text-white
                  transition-all
                "
              >
                <Paperclip size={20} />
              </button>
            )}

            <input
              type="text"
              value={text}
              maxLength={MAX_MESSAGE_LENGTH}
              disabled={
                isUploading ||
                isRecording
              }
              onChange={handleChange}
              placeholder={
                isRecording
                  ? "Recording..."
                  : "Type a message..."
              }
              className="
                flex-1
                bg-transparent
                outline-none
                px-4
                text-white
                placeholder:text-zinc-500
              "
            />

            {isRecording ? (
              <>
                <span
                  className="
                    text-red-400
                    font-semibold
                    text-sm
                    mr-3
                  "
                >
                  {formatTime()}
                </span>

                <button
                  type="button"
                  onClick={stopRecording}
                  className="
                    w-12
                    h-12
                    rounded-full
                    bg-red-500
                    flex
                    items-center
                    justify-center
                    animate-pulse
                  "
                >
                  <Square
                    size={18}
                    fill="white"
                    className="text-white"
                  />
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled={isUploading}
                onClick={startRecording}
                className="
                  w-12
                  h-12
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-zinc-400
                  hover:bg-red-500/10
                  hover:text-white
                  transition-all
                "
              >
                <Mic size={20} />
              </button>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center gap-4 px-2">
            {renderPreview()}

            <div className="flex-1 min-w-0">
              <p className="text-white truncate font-medium">
                {selectedFile.name}
              </p>

              {isUploading ? (
                <p className="text-red-400 text-sm">
                  Uploading...
                </p>
              ) : (
                <p className="text-zinc-500 text-sm">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </div>

            {!isUploading && (
              <button
                type="button"
                onClick={removeFile}
                className="
                  w-10
                  h-10
                  rounded-full
                  flex
                  items-center
                  justify-center
                  hover:bg-red-500/10
                  transition-all
                "
              >
                <X
                  size={18}
                  className="text-zinc-400"
                />
              </button>
            )}
          </div>
        )}
                <button
          type="submit"
          disabled={
            isUploading ||
            isRecording ||
            (!text.trim() && !selectedFile)
          }
          className="
            ml-2
            w-12
            h-12
            rounded-full
            bg-red-500
            flex
            items-center
            justify-center
            text-white
            transition-all
            hover:scale-105
            hover:shadow-[0_0_25px_rgba(239,68,68,0.45)]
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {isUploading ? (
            <div
              className="
                w-5
                h-5
                rounded-full
                border-2
                border-white/30
                border-t-white
                animate-spin
              "
            />
          ) : (
            <Send size={18} />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;