import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

interface Scene {
  id: number
  name: string
  category: string
  description: string
  usage: number
}

interface SceneCategories {
  id: number
  name: string
}

const SceneManagement = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingScene, setEditingScene] = useState<Scene | null>(null)
  const [scenes, setScenes] = useState<Scene[]>([
    { id: 1, name: '销售话术', category: '销售场景', description: '为销售团队生成标准化的销售话术', usage: 156 },
    { id: 2, name: '营销邮件', category: '营销场景', description: '创建个性化的营销邮件内容', usage: 132 },
    { id: 3, name: '客服话术', category: '客服场景', description: '生成专业的客户服务话术', usage: 98 },
    { id: 4, name: '社交媒体', category: '社交媒体', description: '生成适合社交媒体平台的帖子内容', usage: 203 },
    { id: 5, name: '产品推广', category: '产品推广', description: '为新产品发布生成推广文案', usage: 87 },
    { id: 6, name: '活动策划', category: '活动策划', description: '生成活动策划方案和宣传材料', usage: 65 }
  ])

  const sceneCategories: SceneCategories[] = [
    { id: 1, name: '销售场景' },
    { id: 2, name: '营销场景' },
    { id: 3, name: '客服场景' },
    { id: 4, name: '社交媒体' },
    { id: 5, name: '产品推广' },
    { id: 6, name: '活动策划' }
  ]

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Scene>({
    defaultValues: {
      id: 0,
      name: '',
      category: '',
      description: '',
      usage: 0
    }
  })

  const filteredScenes = scenes.filter(scene => {
    const matchesSearch = scene.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scene.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory ? scene.category === selectedCategory : true
    return matchesSearch && matchesCategory
  })

  const handleCreateScene = () => {
    reset({
      id: 0,
      name: '',
      category: '',
      description: '',
      usage: 0
    })
    setEditingScene(null)
    setShowModal(true)
  }

  const handleEditScene = (scene: Scene) => {
    reset(scene)
    setEditingScene(scene)
    setShowModal(true)
  }

  const handleDeleteScene = (sceneId: number) => {
    if (window.confirm('确定要删除这个场景吗？')) {
      setScenes(scenes.filter(scene => scene.id !== sceneId))
    }
  }

  const onSubmit = (data: Scene) => {
    if (editingScene) {
      setScenes(scenes.map(scene => 
        scene.id === editingScene.id ? { ...scene, ...data } : scene
      ))
    } else {
      const newScene: Scene = {
        ...data,
        id: Math.max(...scenes.map(s => s.id)) + 1,
        usage: 0
      }
      setScenes([...scenes, newScene])
    }
    setShowModal(false)
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
            <h1 className="text-xl font-semibold text-dark">场景管理</h1>
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
              <h2 className="text-lg font-semibold text-dark mb-4">场景分类</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedCategory === null ? 'bg-primary text-white' : 'hover:bg-light-gray'
                  }`}
                >全部场景</button>
                {sceneCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedCategory === category.name ? 'bg-primary text-white' : 'hover:bg-light-gray'
                    }`}
                  >{category.name}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-dark">场景列表</h2>
                <button
                  onClick={handleCreateScene}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors"
                >创建场景</button>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="搜索场景..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredScenes.map(scene => (
                  <div
                    key={scene.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-dark">{scene.name}</h3>
                      <span className="text-xs text-dark-gray bg-light-gray px-2 py-1 rounded">{scene.category}</span>
                    </div>
                    <p className="text-sm text-dark-gray mb-3">{scene.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-dark-gray">使用次数: {scene.usage}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/generate?scene=${scene.id}`)}
                          className="text-primary hover:text-blue-600 text-sm"
                        >使用</button>
                        <button
                          onClick={() => handleEditScene(scene)}
                          className="text-gray-600 hover:text-primary text-sm"
                        >编辑</button>
                        <button
                          onClick={() => handleDeleteScene(scene.id)}
                          className="text-danger hover:text-red-600 text-sm"
                        >删除</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-dark">{editingScene ? '编辑场景' : '创建场景'}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-dark-gray hover:text-dark"
              >×</button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-gray mb-1">场景名称</label>
                <input
                  type="text"
                  {...register('name', { required: '场景名称不能为空' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-gray mb-1">场景分类</label>
                <select
                  {...register('category', { required: '请选择场景分类' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">请选择分类</option>
                  {sceneCategories.map(category => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                  ))}
                </select>
                {errors.category && <p className="text-danger text-xs mt-1">{errors.category.message}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-gray mb-1">场景描述</label>
                <textarea
                  {...register('description', { required: '场景描述不能为空' })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {errors.description && <p className="text-danger text-xs mt-1">{errors.description.message}</p>}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-dark-gray rounded-md hover:bg-light-gray transition-colors"
                >取消</button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors"
                >{editingScene ? '保存' : '创建'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SceneManagement