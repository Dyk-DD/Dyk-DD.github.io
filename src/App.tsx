import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import ChatLayout from './components/ChatLayout'
import ChatPage from './pages/ChatPage'
import HistoryPage from './pages/HistoryPage'
import LoginPage from './components/LoginPage'
import { isAuthenticated } from './api/config'

export default function App() {
  const [authed, setAuthed] = useState(isAuthenticated())

  if (!authed) {
    return <LoginPage onLogin={() => setAuthed(true)} />
  }

  return (
    <Routes>
      <Route element={<ChatLayout />}>
        <Route path="/" element={<ChatPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Route>
    </Routes>
  )
}
