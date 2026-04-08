import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface Template {
  _id: string
  name: string
  category: string
  description: string
  content: string
  usageCount: number
  createdBy: {
    name: string
    username: string
  }
  createdAt: string
  updatedAt: string
}

const TemplateLibrary = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    content: ''
  })
  const [error, setError] = useState('')

  const templateCategories = [
    { id: 1, name: '邮件模板' },
    { id: 2, name: '短信模板' },
    { id: 3, name: '话术模板' },
    { id: 4, name: '海报模板' },
    { id: 5, name: '推文模板' },
    { id: 6, name: '活动模板' }
  ]

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      let url = '/api/templates?'
      
      if (selectedCategory) {
        url += `category=${encodeURIComponent(selectedCategory)}&`
      }
      
      if (searchTerm) {
        url += `search=${encodeURIComponent(searchTerm)}`
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        setTemplates(data.templates)
      } else {
        console.error('Failed to fetch templates:', data.error)
      }
    } catch (err) {
      console.error('Error fetching templates:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [selectedCategory, searchTerm])

  const handleCreateTemplate = () => {
    setIsEditing(false)
    setCurrentTemplate(null)
    setFormData({
      name: '',
      category: '',
      description: '',
      content: ''
    })
    setError('')
    setShowModal(true)
  }

  const handleEditTemplate = (template: Template) => {
    setIsEditing(true)
    setCurrentTemplate(template)
    setFormData({
      name: template.name,
      category: template.category,
      description: template.description,
      content: template.content
    })
    setError('')
    setShowModal(true)
  }

  const handleDeleteTemplate = async (templateId: string) => {
    if (window.confirm('确定要删除这个模板吗？')) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`/api/templates/${templateId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await response.json()
        
        if (data.success) {
          fetchTemplates()
        } else {
          alert('删除失败：' + data.error?.message || '未知错误')
        }
      } catch (err) {
        alert('删除失败：网络错误')
      }
    }
  }

  const handleSaveTemplate = async () => {
    if (!formData.name || !formData.category || !formData.description || !formData.content) {
      setError('请填写所有必填字段')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const method = isEditing ? 'PUT' : 'POST'
      const url = isEditing && currentTemplate 
        ? `/api/templates/${currentTemplate._id}`
        : '/api/templates'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (data.success) {
        setShowModal(false)
        fetchTemplates()
      } else {
        setError(data.error?.message || '操作失败')
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
    }
  }

  const handleTemplateUse = async (templateId: string) => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`/api/templates/${templateId}/usage`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      navigate(`/generate?template=${templateId}`)
    } catch (err) {
      navigate(`/generate?template=${templateId}`)
    }
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
            <h1 className="text-xl font-semibold text-dark">模板库</h1>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-dark-gray hover:text-danger"
          >退出</button>
        </div>
      </div>
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-dark mb-4">模板分类</h2>
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${!selectedCategory ? 'bg-primary text-white' : 'hover:bg-light-gray'}`}
              >
                全部模板
              </button>
              <div className="space-y-2 mt-2">
                {templateCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${selectedCategory === category.name ? 'bg-primary text-white' : 'hover:bg-light-gray'}`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-dark">模板列表</h2>
                <button 
                  onClick={handleCreateTemplate}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  创建模板
                </button>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="搜索模板..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : templates.length === 0 ? (
                <div className="text-center py-8 text-dark-gray">
                  暂无模板数据
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map(template => (
                    <div
                      key={template._id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-primary hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-dark">{template.name}</h3>
                        <span className="text-xs text-dark-gray bg-light-gray px-2 py-1 rounded">{template.category}</span>
                      </div>
                      <p className="text-sm text-dark-gray mb-3">{template.description}</p>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-dark-gray">使用次数: {template.usageCount}</span>
                        <span className="text-xs text-dark-gray">创建者: {template.createdBy?.name || '未知'}</span>
                      </div>
                      <div className="flex justify-between">
                        <button
                          onClick={() => handleEditTemplate(template)}
                          className="text-primary hover:text-blue-600 text-sm"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template._id)}
                          className="text-danger hover:text-red-600 text-sm"
                        >
                          删除
                        </button>
                        <button
                          onClick={() => handleTemplateUse(template._id)}
                          className="text-green-600 hover:text-green-700 text-sm"
                        >
                          使用
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-dark">
                {isEditing ? '编辑模板' : '创建模板'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-dark-gray hover:text-dark"
              >
                ×
              </button>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-gray mb-1">
                  模板名称 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="请输入模板名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-gray mb-1">
                  分类 *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">请选择分类</option>
                  {templateCategories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-gray mb-1">
                  模板描述 *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                  placeholder="请输入模板描述"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-gray mb-1">
                  模板内容 *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={6}
                  placeholder="请输入模板内容"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 text-dark-gray rounded-md hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveTemplate}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                {isEditing ? '保存修改' : '创建模板'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TemplateLibrary