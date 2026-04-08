import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MaterialManagement = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMaterials, setSelectedMaterials] = useState<number[]>([])
  const [isAllSelected, setIsAllSelected] = useState(false)

  const materialCategories = [
    { id: 1, name: '全部素材' },
    { id: 2, name: '我的素材' },
    { id: 3, name: '团队素材' },
    { id: 4, name: '收藏素材' },
    { id: 5, name: '最近编辑' },
    { id: 6, name: '已归档' }
  ]

  const materials = [
    { id: 1, title: '产品推广文案', createTime: '2024-01-15', type: '文案', status: '已保存' },
    { id: 2, title: '客户跟进话术', createTime: '2024-01-14', type: '话术', status: '已保存' },
    { id: 3, title: '活动策划方案', createTime: '2024-01-13', type: '方案', status: '已保存' },
    { id: 4, title: '营销邮件模板', createTime: '2024-01-12', type: '邮件', status: '已保存' },
    { id: 5, title: '社交媒体帖子', createTime: '2024-01-11', type: '社交媒体', status: '已保存' },
    { id: 6, title: '产品介绍文档', createTime: '2024-01-10', type: '文档', status: '已保存' }
  ]

  const filteredMaterials = materials.filter(material =>
    material.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelect = (id: number) => {
    setSelectedMaterials(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedMaterials([])
    } else {
      setSelectedMaterials(filteredMaterials.map(material => material.id))
    }
    setIsAllSelected(!isAllSelected)
  }

  const handleBatchDelete = () => {
    if (selectedMaterials.length > 0) {
      if (confirm(`确定要删除选中的 ${selectedMaterials.length} 个素材吗？此操作不可撤销。`)) {
        // 模拟删除操作
        const updatedMaterials = materials.filter(material => !selectedMaterials.includes(material.id))
        console.log('删除的素材:', selectedMaterials)
        console.log('更新后的素材列表:', updatedMaterials)
        
        alert(`成功删除 ${selectedMaterials.length} 个素材`)
        setSelectedMaterials([])
        setIsAllSelected(false)
      }
    }
  }

  const handleBatchExport = () => {
    if (selectedMaterials.length > 0) {
      const selectedItems = filteredMaterials.filter(material => 
        selectedMaterials.includes(material.id)
      )
      console.log('导出的素材:', selectedItems)
      
      // 模拟导出操作
      const exportData = JSON.stringify(selectedItems, null, 2)
      const blob = new Blob([exportData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `素材导出_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      alert(`成功导出 ${selectedMaterials.length} 个素材`)
    }
  }

  const handleBatchShare = () => {
    if (selectedMaterials.length > 0) {
      const selectedItems = filteredMaterials.filter(material => 
        selectedMaterials.includes(material.id)
      )
      console.log('分享的素材:', selectedItems)
      
      // 模拟分享操作 - 弹出分享对话框
      const shareTitle = `分享 ${selectedMaterials.length} 个素材`
      const shareText = `我想分享这些素材给你：${selectedItems.map(item => item.title).join('、')}`
      
      if (navigator.share) {
        navigator.share({
          title: shareTitle,
          text: shareText,
          url: window.location.href
        }).catch(error => {
          console.error('分享失败:', error)
          alert('分享失败，请稍后重试')
        })
      } else {
        // 复制到剪贴板
        navigator.clipboard.writeText(shareText).then(() => {
          alert('分享内容已复制到剪贴板')
        }).catch(error => {
          console.error('复制失败:', error)
          alert('复制失败，请手动复制分享内容')
        })
      }
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
            <h1 className="text-xl font-semibold text-dark">素材管理</h1>
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
              <h2 className="text-lg font-semibold text-dark mb-4">素材分类</h2>
              <div className="space-y-2">
                {materialCategories.map(category => (
                  <button
                    key={category.id}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-light-gray transition-colors"
                  >{category.name}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-dark">素材列表</h2>
                <div className="flex space-x-2">
                  {selectedMaterials.length > 0 && (
                    <>
                      <button
                        onClick={handleBatchDelete}
                        className="px-3 py-1 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors text-sm font-medium"
                      >
                        删除 ({selectedMaterials.length})
                      </button>
                      <button
                        onClick={handleBatchExport}
                        className="px-3 py-1 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm font-medium"
                      >
                        导出 ({selectedMaterials.length})
                      </button>
                      <button
                        onClick={handleBatchShare}
                        className="px-3 py-1 border border-green-300 text-green-600 rounded-md hover:bg-green-50 transition-colors text-sm font-medium"
                      >
                        分享 ({selectedMaterials.length})
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="搜索素材..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                {filteredMaterials.length > 0 && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm text-dark-gray">全选</span>
                    </div>
                    <span className="text-sm text-dark-gray">
                      共 {filteredMaterials.length} 个素材
                    </span>
                  </div>
                )}
                {filteredMaterials.map(material => (
                  <div
                    key={material.id}
                    className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                      selectedMaterials.includes(material.id)
                        ? 'border-primary bg-blue-50'
                        : 'border-gray-200 hover:border-primary'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedMaterials.includes(material.id)}
                        onChange={() => handleSelect(material.id)}
                        className="w-4 h-4 text-primary"
                      />
                      <div>
                        <h3 className="font-medium text-dark">{material.title}</h3>
                        <div className="flex items-center space-x-4 text-xs text-dark-gray">
                          <span>{material.createTime}</span>
                          <span>{material.type}</span>
                          <span>{material.status}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/generate?material=${material.id}`)}
                      className="text-primary hover:text-blue-600 text-sm"
                    >编辑</button>
                  </div>
                ))}
                {filteredMaterials.length === 0 && (
                  <div className="text-center py-8 text-dark-gray">
                    没有找到匹配的素材
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MaterialManagement