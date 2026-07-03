import Sidebar from "../components/Sidebar.jsx";
import { Outlet } from "react-router";

const ChatPage = () => {
  return (
    <div className="h-screen bg-black text-white flex overflow-hidden">
      <Sidebar />

      <main className="flex-1 bg-zinc-950">
        <Outlet />
      </main>
    </div>
  );
};

export default ChatPage;