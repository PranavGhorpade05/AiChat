'use client'

import React, { useState } from 'react'
import { IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import EditIcon from '@mui/icons-material/Edit'
import { signOut } from 'next-auth/react'
import RenameModal from './RenameModal'
import styles from '../styles/Sidebar.module.css'

export default function Sidebar({
  chats,
  currentChat,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat,
  onProfileClick,
  userEmail,
}) {
  const [renameModalOpen, setRenameModalOpen] = useState(false)
  const [renamingChatId, setRenamingChatId] = useState(null)
  const currentChatData = chats.find((c) => c.id === renamingChatId)

  const handleRenameClick = (e, chatId) => {
    e.stopPropagation()
    setRenamingChatId(chatId)
    setRenameModalOpen(true)
  }

  const handleRenameConfirm = async (newName) => {
    if (onRenameChat) {
      await onRenameChat(renamingChatId, newName)
    }
  }
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h1>AI Chat</h1>
        <IconButton onClick={onNewChat} size="small" className={styles.newChatBtn}>
          <AddIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </div>

      <div className={styles.chatList}>
        {chats.length === 0 ? (
          <p className={styles.empty}>No chats yet. Start a new conversation!</p>
        ) : (
          [...chats].reverse().map((chat) => (
            <div
              key={chat.id}
              className={`${styles.chatItem} ${
                currentChat === chat.id ? styles.active : ''
              }`}
            >
              <div
                className={styles.chatContent}
                onClick={() => onSelectChat(chat.id)}
              >
                <p className={styles.chatTitle}>{chat.title}</p>
                <p className={styles.chatDate}>
                  {new Date(chat.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className={styles.chatActions}>
                <IconButton
                  size="small"
                  onClick={(e) => handleRenameClick(e, chat.id)}
                  className={styles.renameBtn}
                  title="Rename chat"
                >
                  <EditIcon sx={{ fontSize: 16 }} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onDeleteChat(chat.id)}
                  className={styles.deleteBtn}
                  title="Delete chat"
                >
                  <DeleteIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <IconButton onClick={onProfileClick} size="small">
            <PersonIcon sx={{ fontSize: 30,color:'white' }} />
          </IconButton>
          <span className={styles.email}>{userEmail}</span>
        </div>
        <IconButton
          onClick={() => signOut()}
          size="small"
          className={styles.logoutBtn}
        >
          <LogoutIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </div>

      <RenameModal
        open={renameModalOpen}
        onClose={() => setRenameModalOpen(false)}
        currentName={currentChatData?.title || ''}
        onRename={handleRenameConfirm}
      />
    </aside>
  )
}
