'use client'

import React, { useEffect, useRef } from 'react'
import { CircularProgress } from '@mui/material'
import styles from '../styles/ChatWindow.module.css'
import ReactMarkdown from "react-markdown";

export default function ChatWindow({ messages, loading }) {
  const endOfMessagesRef = useRef(null)

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className={styles.chatWindow}>
      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.message} ${styles[message.role]}`}
          >
            <div className={styles.messageContent}>
              <ReactMarkdown>
                {message.content}
              </ReactMarkdown>
            </div>
            <span className={styles.timestamp}>
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
        {loading && (
          <div className={styles.loadingContainer}>
            <CircularProgress size={30} />
            <p>AI is thinking...</p>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  )
}
