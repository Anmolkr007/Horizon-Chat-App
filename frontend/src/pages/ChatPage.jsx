import Sidebar from "../components/Sidebar.jsx";
import { useChatStore } from "../store/chatStore.js";

import BlockedByUserPage from "./BlockedByUserPage.jsx";
import BlockedUserPage from "./BlockedUserPage.jsx";
import EmptyConversationPage from "./EmptyConversationPage.jsx";
import SendFriendRequestPage from "./SendFriendRequestPage.jsx";
import FriendRequestSentPage from "./FriendRequestSentPage.jsx";
import IncomingFriendRequestPage from "./IncomingFriendRequestPage.jsx";
import ChatContainer from "./ChatContainer.jsx";

const ChatPage = () => {
  const {
    selectedUser,
    isMessageLoading,
  } = useChatStore();

  let content;

  // Loading state for right side
  if (isMessageLoading) {
    content = (
      <div className="flex flex-col items-center justify-center h-full gap-5">
        <div className="relative">
          {/* Red glow */}
          <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full scale-150" />

          {/* Spinner */}
          <div
            className="
              relative
              w-16
              h-16
              rounded-full
              border-4
              border-zinc-800
              border-t-red-500
              animate-spin
            "
          />
        </div>

        <p className="text-zinc-400 text-sm tracking-wider">
          Loading conversation...
        </p>
      </div>
    );
  }

  // No selected user
  else if (!selectedUser) {
    content = <EmptyConversationPage />;
  }

  // Relationship states
  else {
    switch (selectedUser.relationshipStatus) {
      case "none":
        content = (
          <SendFriendRequestPage
            user={selectedUser}
          />
        );
        break;

      case "request_sent":
        content = (
          <FriendRequestSentPage
            user={selectedUser}
          />
        );
        break;

      case "request_received":
        content = (
          <IncomingFriendRequestPage
            user={selectedUser}
          />
        );
        break;

      case "blocked_by_me":
        content = (
          <BlockedUserPage
            user={selectedUser}
          />
        );
        break;

      case "blocked_by_user":
        content = (
          <BlockedByUserPage
            user={selectedUser}
          />
        );
        break;

      case "accepted":
        content = (
          <ChatContainer
            user={selectedUser}
          />
        );
        break;

      default:
        content = <EmptyConversationPage />;
    }
  }

  return (
    <div className="h-screen bg-black text-white flex overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Content */}
      <main className="flex-1 bg-zinc-950 overflow-hidden">
        {content}
      </main>
    </div>
  );
};

export default ChatPage;