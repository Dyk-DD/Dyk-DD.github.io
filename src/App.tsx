import { Routes, Route } from 'react-router-dom'
import ChatLayout from './components/ChatLayout'
import ChatPage from './pages/ChatPage'
import HistoryPage from './pages/HistoryPage'

export default function App() {
  return (
    <Routes>
      <Route element={<ChatLayout />}>
        <Route path="/" element={<ChatPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Route>
    </Routes>
  )
}
