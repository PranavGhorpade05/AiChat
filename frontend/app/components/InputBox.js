'use client'

import React, { useState } from 'react'
import { IconButton, TextField } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import styles from '../styles/InputBox.module.css'

export default function InputBox({ onSendMessage, loading }) {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input)
      setInput('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={styles.inputBox}>
      <TextField
        fullWidth
        multiline
        maxRows={4}
        minRows={1}
        placeholder="Type your message here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={loading}
        variant="outlined"
        className={styles.input}
      />
      <IconButton
        onClick={handleSend}
        disabled={loading || !input.trim()}
        className={styles.sendBtn}
      >
        <SendIcon sx={{ fontSize: 30 }} />
      </IconButton>
    </div>
  )
}
