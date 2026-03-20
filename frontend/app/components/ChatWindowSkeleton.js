'use client'

import React from 'react'
import { Box, Skeleton, Paper } from '@mui/material'
import styles from '../styles/ChatWindow.module.css'

export default function ChatWindowSkeleton() {
  return (
    <div className={styles.chatWindow}>
      <div className={styles.messagesContainer}>
        {/* User message skeleton */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Skeleton 
            variant="rounded" 
            width="60%" 
            height={60} 
            sx={{ bgcolor: '#e0e0e01d' }}
          />
        </Box>
        {/* AI message skeleton */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-start' }}>
          <Skeleton 
            variant="rounded" 
            width="60%" 
            height={80} 
            sx={{ bgcolor: '#f5f5f554' }}
          />
        </Box>
        {/* Loading indicator */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="80%" sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="60%" />
          </Box>
        </Box>
      </div>
    </div>
  )
}
