import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useGlobal } from '../contexts/GlobalContext'

const ContentGeneration = () => {
  const navigate = useNavigate()
  const { addMessage, showLoading, hideLoading } = useGlobal()
  const [formData, setFormData] = useState({
    productName: '',
    targetCustomer: '',
    keySellingPoints: '',
    styleRequirements: ''
  })
  const [generatedContent, setGeneratedContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleGenerate = async () => {
    showLoading('content-generation', '正在生成内容...')
    setGeneratedContent('')
    setIsLoading(true)

    try {
      const response = await api.post('/content/generate', {
        sceneId: '657d23b1c8e7f8a9b0c1d2e3',
        parameters: formData
      })

      if (response.data.success) {
        setGeneratedContent(response.data.content.content)
        addMessage({
          type: 'success',
          content: '内容生成成功！'
        })
      } else {
        throw new Error(response.data.error?.message || '生成失败')
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '生成内容时发生错误，请稍后重试'
      addMessage({
        type: 'error',
        content: errorMessage
      })
      console.error('生成失败:', error)
    } finally {
      hideLoading('content-generation')
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
    addMessage({
      type: 'success',
      content: '内容已复制到剪贴板'
    })
  }

  const handleSave = () => {
    addMessage({
      type: 'success',
      content: '内容已保存'
    })
  }

  const handleExport = () => {
    const blob = new Blob([generatedContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'marketing-content.md'
    a.click()
    URL.revokeObjectURL(url)
    addMessage({
      type: 'success',
      content: '内容已导出'
    })
  }

  return (
    <div className="min-h-screen bg-light-bg">
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-dark-gray hover:text-dark"
            >←</button>
            <h1 className="text-xl font-semibold text-dark">内容生成</h1>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-dark-gray hover:text-danger"
          >退出</button>
        </div>
      </div>
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-dark mb-4">参数配置</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="productName" className="block text-sm font-medium text-dark mb-1">产品名称</label>
                  <input
                    type="text"
                    id="productName"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="请输入产品名称"
                  />
                </div>
                <div>
                  <label htmlFor="targetCustomer" className="block text-sm font-medium text-dark mb-1">目标客户</label>
                  <input
                    type="text"
                    id="targetCustomer"
                    name="targetCustomer"
                    value={formData.targetCustomer}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="请输入目标客户描述"
                  />
                </div>
                <div>
                  <label htmlFor="keySellingPoints" className="block text-sm font-medium text-dark mb-1">核心卖点</label>
                  <textarea
                    id="keySellingPoints"
                    name="keySellingPoints"
                    value={formData.keySellingPoints}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="请输入核心卖点，每行一个"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="styleRequirements" className="block text-sm font-medium text-dark mb-1">风格要求</label>
                  <input
                    type="text"
                    id="styleRequirements"
                    name="styleRequirements"
                    value={formData.styleRequirements}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="请输入风格要求"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors font-medium disabled:opacity-50"
                >{isLoading ? '生成中...' : '生成内容'}</button>
              </form>
            </div>
          </div>
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-dark mb-4">内容预览</h2>
              <div className="border border-gray-200 rounded-lg p-4 mb-4 min-h-[400px] bg-light-bg">
                {generatedContent ? (
                  <div className="space-y-4">
                    <div className="flex justify-end space-x-2 mb-4">
                      <button
                        onClick={handleCopy}
                        className="px-3 py-1 border border-gray-300 rounded-md hover:bg-light-gray transition-colors text-sm"
                      >复制</button>
                      <button
                        onClick={handleSave}
                        className="px-3 py-1 border border-gray-300 rounded-md hover:bg-light-gray transition-colors text-sm"
                      >保存</button>
                      <button
                        onClick={handleExport}
                        className="px-3 py-1 border border-gray-300 rounded-md hover:bg-light-gray transition-colors text-sm"
                      >导出</button>
                    </div>
                    <pre className="whitespace-pre-wrap text-sm text-dark">{generatedContent}</pre>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-dark-gray">生成的内容将在这里显示</div>
                )}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentGeneration