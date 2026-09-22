import React, { useState } from "react";
import { FiHash, FiMessageCircle, FiShield, FiUser, FiZap } from "react-icons/fi";
import toast from "react-hot-toast";
import chatIcon from "../assets/chat.png";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";

const JoinCreateChat = () => {
  const [detail, setDetail] = useState({ roomId: "", userName: "" });
  const [loading, setLoading] = useState("");
  const { setRoomId, setCurrentUser, setConnected } = useChatContext();
  const navigate = useNavigate();

  const handleFormInputChange = (event) => {
    setDetail((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const validateForm = () => {
    const userName = detail.userName.trim();
    const roomId = detail.roomId.trim();

    if (!userName || !roomId) {
      toast.error("Enter your name and a room ID.");
      return false;
    }
    if (userName.length < 2) {
      toast.error("Your name should contain at least 2 characters.");
      return false;
    }
    return true;
  };

  const enterRoom = (room) => {
    setCurrentUser(detail.userName.trim());
    setRoomId(room.roomId);
    setConnected(true);
    navigate("/chat");
  };

  const joinChat = async () => {
    if (!validateForm()) return;
    setLoading("join");
    try {
      const room = await joinChatApi(detail.roomId.trim());
      toast.success("Welcome to the room!");
      enterRoom(room);
    } catch (error) {
      toast.error(error?.response?.data || "Room not found. Check the room ID.");
    } finally {
      setLoading("");
    }
  };

  const createRoom = async () => {
    if (!validateForm()) return;
    setLoading("create");
    try {
      const room = await createRoomApi(detail.roomId.trim());
      toast.success("Room created successfully!");
      enterRoom(room);
    } catch (error) {
      toast.error(error?.status === 400 ? "That room already exists." : "Could not create the room.");
    } finally {
      setLoading("");
    }
  };

  const submitOnEnter = (event) => {
    if (event.key === "Enter") joinChat();
  };

  return (
    <div className="join-shell">
      <div className="join-grid">
        <section className="brand-panel">
          <div className="brand-chip"><FiZap /> Real-time conversations</div>
          <h1 className="brand-title">Chat together.<br /><span>Stay connected.</span></h1>
          <p className="brand-copy">
            A simple, fast chat room experience powered by React, Spring Boot,
            WebSocket and MongoDB. Create a room, share the ID, and start talking.
          </p>
          <div className="feature-row">
            <span className="feature-pill"><FiMessageCircle /> Live messages</span>
            <span className="feature-pill"><FiShield /> Room-based</span>
            <span className="feature-pill"><FiZap /> Instant delivery</span>
          </div>
        </section>

        <section className="join-card">
          <div className="logo-box">
            <img src={chatIcon} alt="Chat" style={{ width: 34, height: 34, objectFit: "contain" }} />
          </div>
          <h2 className="join-heading">Enter the conversation</h2>
          <p className="join-subtitle">Choose a display name and join an existing room or create a new one.</p>

          <div className="field">
            <label htmlFor="userName">Display name</label>
            <div className="input-wrap">
              <FiUser className="input-icon" />
              <input
                id="userName"
                name="userName"
                value={detail.userName}
                onChange={handleFormInputChange}
                onKeyDown={submitOnEnter}
                className="modern-input"
                placeholder="e.g. Golu"
                maxLength={30}
                autoComplete="name"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="roomId">Room ID</label>
            <div className="input-wrap">
              <FiHash className="input-icon" />
              <input
                id="roomId"
                name="roomId"
                value={detail.roomId}
                onChange={handleFormInputChange}
                onKeyDown={submitOnEnter}
                className="modern-input"
                placeholder="e.g. java-friends"
                maxLength={50}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="action-grid">
            <button className="action-btn join-btn" onClick={joinChat} disabled={!!loading}>
              {loading === "join" ? "Joining..." : "Join room"}
            </button>
            <button className="action-btn create-btn" onClick={createRoom} disabled={!!loading}>
              {loading === "create" ? "Creating..." : "Create room"}
            </button>
          </div>
          <p className="card-note">Your display name is only used inside this chat room.</p>
        </section>
      </div>
    </div>
  );
};

export default JoinCreateChat;
