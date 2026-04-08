import { createContext, useContext, useState, ReactNode } from 'react'

export type MessageType = 'success' | 'error' | 'warning' | 'info'

export interface Message {
  id: string
  type: MessageType
  content: string
  duration?: number
}

export interface LoadingState {
  id: string
  text?: string
}

interface GlobalContextType {
  messages: Message[]
  loadingStates: LoadingState[]
  addMessage: (message: Omit<Message, 'id'>) => void
  removeMessage: (id: string) => void
  showLoading: (id: string, text?: string) => void
  hideLoading: (id: string) => void
  clearAllMessages: () => void
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export const useGlobal = () => {
  const context = useContext(GlobalContext)
  if (!context) {
    throw new Error('useGlobal must be used within a GlobalProvider')
  }
  return context
}

interface GlobalProviderProps {
  children: ReactNode
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingStates, setLoadingStates] = useState<LoadingState[]>([])

  const addMessage = (message: Omit<Message, 'id'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString()
    }
    setMessages(prev => [...prev, newMessage])

    const duration = message.duration || 3000
    setTimeout(() => {
      removeMessage(newMessage.id)
    }, duration)
  }

  const removeMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id))
  }

  const showLoading = (id: string, text?: string) => {
    setLoadingStates(prev => [...prev, { id, text }])
  }

  const hideLoading = (id: string) => {
    setLoadingStates(prev => prev.filter(state => state.id !== id))
  }

  const clearAllMessages = () => {
    setMessages([])
  }

  const value: GlobalContextType = {
    messages,
    loadingStates,
    addMessage,
    removeMessage,
    showLoading,
    hideLoading,
    clearAllMessages
  }

  return (<GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>)
}
