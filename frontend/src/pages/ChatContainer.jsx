import {
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

import ChatHeader from "../components/ChatHeader.jsx";
import MessageInput from "../components/MessageInput.jsx";
import MessageBubble from "../components/MessageBubble.jsx";
import { useChatStore } from "../store/chatStore.js";
import { useAuthStore } from "../store/authStore.js";

const ChatContainer = ({ user }) => {
  const { messages, subscribeToMessage, unsubscribeFromMessage,selectedUser } = useChatStore();
  const { user: currentUser } = useAuthStore();

  const messagesContainerRef = useRef(null);

  // Instantly scroll when opening a chat
  useLayoutEffect(() => {
    if (!messagesContainerRef.current) return;

    requestAnimationFrame(() => {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    });
  }, [user?.id]);

  // Smooth scroll when new messages arrive
  useEffect(() => {
    if (!messagesContainerRef.current) return;

    messagesContainerRef.current.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);
  useEffect(() => {
    if (!selectedUser) return;

    if (selectedUser.relationshipStatus !== "accepted") {
        return;
    }

    subscribeToMessage();

    return () => {
        unsubscribeFromMessage();
    };
}, [selectedUser?.id, selectedUser?.relationshipStatus]);

console.log("messages:", messages);
console.log("isArray:", Array.isArray(messages));

  return (
    <div className="h-full flex flex-col bg-[#090909] relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute -top-60 -left-60 w-[700px] h-[700px] bg-red-500/5 rounded-full blur-[250px]" />
      <div className="absolute -bottom-60 -right-60 w-[700px] h-[700px] bg-red-500/5 rounded-full blur-[250px]" />

      <ChatHeader user={user} />

      <div
        ref={messagesContainerRef}
        className="
          flex-1
          overflow-y-auto
          no-scrollbar
          px-8
          py-6
          relative
          z-10
        "
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <img
              src={user?.profilepic_url}
              alt={user?.name}
              className="
                w-32
                h-32
                rounded-full
                object-cover
                border-2 border-red-500/20
                shadow-[0_0_50px_rgba(239,68,68,0.15)]
              "
            />

            <h1 className="mt-8 text-4xl font-bold text-white">
              {user?.name}
            </h1>

            <p className="mt-4 text-zinc-500 text-lg">
              Your conversation starts here.
            </p>

            <p className="text-zinc-600 mt-2">
              Send a message to begin chatting.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              own={message.sender_id === currentUser.id}
            />
          ))
        )}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;