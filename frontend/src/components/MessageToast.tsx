import { useGlobal } from '../contexts/GlobalContext'

const MessageToast = () => {
  const { messages, removeMessage } = useGlobal()

  const getMessageStyle = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return 'ℹ️'
    }
  }

  if (messages.length === 0) return null

  return (<div className="fixed top-4 right-4 z-50 space-y-2">{messages.map((message) => (<div
          key={message.id}
          className={`${getMessageStyle(message.type)} border rounded-lg shadow-lg p-4 flex items-start space-x-3 transform transition-all duration-300 ease-in-out animate-slide-in`}
        ><span className="text-lg">{getIcon(message.type)}</span><div className="flex-1"><p className="text-sm font-medium">{message.content}</p></div><button
            onClick={() =>removeMessage(message.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕</button></div>))}</div>)
}

export default MessageToast
