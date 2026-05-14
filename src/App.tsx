import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import ChatLayout from './components/ChatLayout'
import ChatPage from './pages/ChatPage'
import HistoryPage from './pages/HistoryPage'
import LoginPage from './components/LoginPage'
import PatientGate from './components/PatientGate'
import { isAuthenticated, hasPatient } from './api/config'

export default function App() {
  const [authed, setAuthed] = useState(isAuthenticated())
  const [patientReady, setPatientReady] = useState(hasPatient())

  if (!authed) {
    return <LoginPage onLogin={() => setAuthed(true)} />
  }

  if (!patientReady) {
    return <PatientGate onReady={() => setPatientReady(true)} />
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
