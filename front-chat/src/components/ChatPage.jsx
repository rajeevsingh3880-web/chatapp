import React, { useEffect, useRef, useState } from "react";
import { FiCopy, FiHash, FiLogOut, FiMessageSquare, FiPaperclip, FiSend } from "react-icons/fi";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { baseURL } from "../config/AxiosHelper";
import { getMessagess } from "../services/RoomService";
import { timeAgo } from "../config/helper";

const initials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";

const ChatPage = () => {
  const { roomId, currentUser, connected, setConnected, setRoomId, setCurrentUser } = useChatContext();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (!connected) navigate("/");
  }, [connected, navigate]);

  useEffect(() => {
    if (!connected || !roomId) return;

    let active = true;
    const loadMessages = async () => {
      try {
        const data = await getMessagess(roomId);
        if (active) setMessages(data);
      } catch {
        toast.error("Could not load previous messages.");
      }
    };
    loadMessages();
    return () => { active = false; };
  }, [connected, roomId]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({ top: chatBoxRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!connected || !roomId) return;

    const sock = new SockJS(`${baseURL}/chat`);
    const client = Stomp.over(sock);
    client.debug = () => {};

    client.connect({}, () => {
      setStompClient(client);
      toast.success("Connected to room", { id: "chat-connected" });
      client.subscribe(`/topic/room/${roomId}`, (message) => {
        setMessages((prev) => [...prev, JSON.parse(message.body)]);
      });
    }, () => {
      toast.error("Connection lost. Please rejoin the room.");
    });

    return () => {
      try {
        if (client.connected) client.disconnect();
      } catch {}
      setStompClient(null);
    };
  }, [connected, roomId]);

  const sendMessage = () => {
    const content = input.trim();
    if (!content || !stompClient || !connected) return;

    stompClient.send(
      `/app/sendMessage/${roomId}`,
      {},
      JSON.stringify({ sender: currentUser, content, roomId })
    );
    setInput("");
  };

  const handleLogout = () => {
    try {
      if (stompClient?.connected) stompClient.disconnect();
    } catch {}
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    navigate("/");
  };

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied!");
    } catch {
      toast.error("Could not copy the room ID.");
    }
  };

  return (
    <div className="chat-shell">
      <header className="chat-header">
        <div className="room-meta">
          <div className="room-avatar"><FiHash size={20} /></div>
          <div>
            <div className="room-title">Chat Room</div>
            <div className="room-id">#{roomId}</div>
          </div>
        </div>

        <div className="header-actions">
          <div className="connection"><span className="connection-dot" /> Connected</div>
          <div className="user-chip">
            <span className="avatar">{initials(currentUser)}</span>
            <span>{currentUser}</span>
          </div>
          <button className="icon-btn" title="Copy room ID" onClick={copyRoomId}><FiCopy /></button>
          <button className="leave-btn" onClick={handleLogout} title="Leave room">
            <FiLogOut /><span>Leave</span>
          </button>
        </div>
      </header>

      <main ref={chatBoxRef} className="chat-main">
        <div className="message-list">
          {messages.length === 0 ? (
            <div className="empty-chat">
              <div>
                <div className="empty-icon"><FiMessageSquare size={27} /></div>
                <h2>No messages yet</h2>
                <p>Be the first person to say hello 👋</p>
              </div>
            </div>
          ) : messages.map((message, index) => {
            const mine = message.sender === currentUser;
            return (
              <div key={`${message.timeStamp}-${index}`} className={`message-row ${mine ? "mine" : ""}`}>
                <div className="message-bubble">
                  <div className="message-top">
                    <span className="sender">{mine ? "You" : message.sender}</span>
                    <span className="message-time">{timeAgo(message.timeStamp)}</span>
                  </div>
                  <p className="message-text">{message.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <div className="composer-wrap">
        <div className="composer">
          <button className="icon-btn" title="Attachments are not enabled yet" onClick={() => toast("File sharing is coming soon.")}>
            <FiPaperclip />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Write a message..."
            maxLength={1000}
            aria-label="Message"
          />
          <button className="icon-btn send-btn" onClick={sendMessage} disabled={!input.trim()} title="Send message">
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
