import { useGlobal } from '../contexts/GlobalContext'

const LoadingOverlay = () => {
  const { loadingStates } = useGlobal()

  if (loadingStates.length === 0) return null

  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center space-y-4"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>{loadingStates.length > 0 && loadingStates[0].text && (<p className="text-sm text-dark font-medium">{loadingStates[0].text}</p>)}</div></div>)
}

export default LoadingOverlay
