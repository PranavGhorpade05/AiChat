"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import ChatWindowSkeleton from "./ChatWindowSkeleton";
import InputBox from "./InputBox";
import ProfileModal from "./ProfileModal";
import styles from "../styles/ChatContainer.module.css";
import { Box, CircularProgress } from "@mui/material";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function for API calls
const apiCall = async (
  method,
  endpoint,
  data = null,
  userEmail = "user@local",
) => {
  const config = { headers: { "X-User-Email": userEmail } };
  const url = `${API_URL}${endpoint}`;

  try {
    const response = await axios({ method, url, data, ...config });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default function ChatContainer() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isNewChat, setIsNewChat] = useState(false);

  const userEmail = session?.user?.email || "user@local";

  const loadChats = useCallback(async () => {
    const result = await apiCall("get", "/api/chats", null, userEmail);
    if (result.success) setChats(result.data);
    else console.error("Failed to load chats:", result.error);
  }, [userEmail]);

  const selectChat = useCallback(
    async (chatId) => {
      const result = await apiCall(
        "get",
        `/api/chats/${chatId}`,
        null,
        userEmail,
      );
      if (result.success) {
        setCurrentChat(chatId);
        setMessages(result.data.messages);
        setIsNewChat(false);
      } else console.error("Failed to load chat:", result.error);
    },
    [userEmail],
  );

  const createNewChat = useCallback(async () => {
    const result = await apiCall(
      "post",
      "/api/chats",
      { title: "New Chat" },
      userEmail,
    );
    if (result.success) {
      setChats((prev) => [...prev, result.data]);
      setCurrentChat(result.data.id);
      setMessages([]);
      setIsNewChat(true);
    } else alert("Failed to create new chat. Please try again.");
  }, [userEmail]);

  const sendMessage = useCallback(
    async (message) => {
      if (!message.trim() || !currentChat) return;

      const userMessage = {
        id: Date.now().toString(),
        content: message,
        role: "user",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);

      const result = await apiCall(
        "post",
        `/api/chats/${currentChat}/messages`,
        { message, history: messages },
        userEmail,
      );
      setLoading(false);

      if (result.success) {
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          content: result.data.response,
          role: "assistant",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === currentChat
              ? {
                  ...chat,
                  title:
                    chat.title === "New Chat"
                      ? message.substring(0, 30) + "..."
                      : chat.title,
                  messages: [...messages, userMessage, aiMessage],
                }
              : chat,
          ),
        );
        setIsNewChat(false);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            content: "Error: Could not get response from AI. Please try again.",
            role: "assistant",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    },
    [currentChat, messages, userEmail],
  );

  const deleteChat = useCallback(
    async (chatId) => {
      const result = await apiCall(
        "delete",
        `/api/chats/${chatId}`,
        null,
        userEmail,
      );
      if (result.success) {
        setChats((prev) => prev.filter((chat) => chat.id !== chatId));
        if (currentChat === chatId) {
          setCurrentChat(null);
          setMessages([]);
        }
      } else alert(`Failed to delete chat: ${result.error}`);
    },
    [currentChat, userEmail],
  );

  const renameChat = useCallback(
    async (chatId, newTitle) => {
      const result = await apiCall(
        "put",
        `/api/chats/${chatId}`,
        { title: newTitle },
        userEmail,
      );
      if (result.success) {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId ? { ...chat, title: newTitle } : chat,
          ),
        );
      } else alert(`Failed to rename chat: ${result.error}`);
    },
    [userEmail],
  );

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") loadChats();
  }, [status, loadChats]);

  if (status === "loading")
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  if (status === "unauthenticated") return null;

  const user = {
    name: session?.user?.name || "User",
    email: session?.user?.email || "user@local",
    image: session?.user?.image,
  };

  return (
    <div className={styles.container}>
      <Sidebar
        chats={chats}
        currentChat={currentChat}
        onSelectChat={selectChat}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
        onRenameChat={renameChat}
        onProfileClick={() => setProfileOpen(true)}
        userEmail={userEmail}
      />
      <div className={styles.mainContent}>
        {currentChat ? (
          isNewChat && !messages.length ? (
            <div className={styles.skeleton}>
              <ChatWindowSkeleton />
            </div>
          ) : (
            <ChatWindow messages={messages} loading={loading} />
          )
        ) : (
          <div className={styles.emptyState}>
            <h1>Welcome to AI Chat</h1>
            <button onClick={createNewChat}>Start a new conversation</button>
          </div>
        )}
        {currentChat && (
          <InputBox onSendMessage={sendMessage} loading={loading} />
        )}
      </div>
      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
      />
    </div>
  );
}
