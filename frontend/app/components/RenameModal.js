'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material'

export default function RenameModal({ open, onClose, currentName, onRename }) {
  const [newName, setNewName] = useState(currentName)

  const handleRename = () => {
    if (newName.trim()) {
      onRename(newName.trim())
      onClose()
    }
  }

  const handleClose = () => {
    setNewName(currentName)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Rename Chat</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TextField
          fullWidth
          label="Chat Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter new chat name"
          autoFocus
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleRename()
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleRename}
          variant="contained"
          disabled={!newName.trim() || newName === currentName}
        >
          Rename
        </Button>
      </DialogActions>
    </Dialog>
  )
}
