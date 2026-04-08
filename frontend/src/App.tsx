import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SceneManagement from './pages/SceneManagement'
import TemplateLibrary from './pages/TemplateLibrary'
import ContentGeneration from './pages/ContentGeneration'
import MaterialManagement from './pages/MaterialManagement'
import Settings from './pages/Settings'
import { GlobalProvider } from './contexts/GlobalContext'
import MessageToast from './components/MessageToast'
import LoadingOverlay from './components/LoadingOverlay'

function App() {
  const isAuthenticated = !!localStorage.getItem('token')

  return (<GlobalProvider><Router><Routes>{/* 公共路由 */}<Route path="/login" element={<Login />} />{/* 需要认证的路由 */}<Route path="/" element={isAuthenticated ? (<Navigate to="/dashboard" />) : (<Navigate to="/login" />)} /><Route path="/dashboard" element={isAuthenticated ? (<Dashboard />) : (<Navigate to="/login" />)} /><Route path="/scenes" element={isAuthenticated ? (<SceneManagement />) : (<Navigate to="/login" />)} /><Route path="/templates" element={isAuthenticated ? (<TemplateLibrary />) : (<Navigate to="/login" />)} /><Route path="/generate" element={isAuthenticated ? (<ContentGeneration />) : (<Navigate to="/login" />)} /><Route path="/materials" element={isAuthenticated ? (<MaterialManagement />) : (<Navigate to="/login" />)} /><Route path="/settings" element={isAuthenticated ? (<Settings />) : (<Navigate to="/login" />)} /></Routes><MessageToast /><LoadingOverlay /></Router></GlobalProvider>)
}

export default App