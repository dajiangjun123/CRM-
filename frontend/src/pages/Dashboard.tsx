import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()

  const quickActions = [
    { id: 1, name: '快速生成', icon: '⚡', path: '/generate' },
    { id: 2, name: '最近使用', icon: '📋', path: '/materials' },
    { id: 3, name: '热门场景', icon: '🔥', path: '/scenes' }
  ]

  const systemStats = [
    { id: 1, label: '生成次数', value: '128', color: 'blue' },
    { id: 2, label: '保存素材', value: '85', color: 'green' },
    { id: 3, label: '使用时长', value: '23小时', color: 'orange' }
  ]

  const recommendedScenes = [
    { id: 1, name: '销售话术生成', description: '为销售团队生成标准化的销售话术' },
    { id: 2, name: '营销邮件生成', description: '创建个性化的营销邮件内容' },
    { id: 3, name: '社交媒体内容', description: '生成适合社交媒体平台的帖子内容' }
  ]

  const recentActivities = [
    { id: 1, time: '10:30', activity: '生成产品推广文案' },
    { id: 2, time: '09:15', activity: '编辑客户跟进话术' },
    { id: 3, time: '昨天', activity: '保存活动方案' }
  ]

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  return (
    <div className="min-h-screen bg-light-bg">
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-semibold text-dark">CRM智能营销素材生成系统</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="flex items-center space-x-2 text-dark-gray hover:text-dark">
                <span>管理员</span>
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">管</div>
              </button>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('token')
                navigate('/login')
              }}
              className="text-dark-gray hover:text-danger"
            >退出</button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-dark mb-4">快捷操作</h2>
            <div className="grid grid-cols-3 gap-4">
              {quickActions.map(action => (
                <button
                  key={action.id}
                  onClick={() => handleNavigation(action.path)}
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors"
                >
                  <span className="text-2xl mb-2">{action.icon}</span>
                  <span className="text-sm text-dark-gray">{action.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-dark mb-4">系统统计数据</h2>
            <div className="grid grid-cols-3 gap-4">
              {systemStats.map(stat => (
                <div key={stat.id} className="text-center">
                  <div className={`text-2xl font-bold mb-1 ${stat.color === 'blue' ? 'text-primary' : stat.color === 'green' ? 'text-secondary' : 'text-warning'}`}>{stat.value}</div>
                  <div className="text-sm text-dark-gray">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-dark mb-4">推荐场景</h2>
            <div className="space-y-3">
              {recommendedScenes.map(scene => (
                <button
                  key={scene.id}
                  onClick={() => navigate('/scenes')}
                  className="flex items-start space-x-3 p-3 hover:bg-light-gray rounded-lg transition-colors w-full text-left"
                >
                  <div className="mt-1">
                    <span className="block font-medium text-dark">{scene.name}</span>
                    <span className="block text-sm text-dark-gray mt-1">{scene.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-dark mb-4">最近活动</h2>
            <div className="space-y-3">
              {recentActivities.map(activity => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-light-gray rounded-lg transition-colors">
                  <div className="mt-1 text-sm text-dark-gray">{activity.time}</div>
                  <div>
                    <span className="block text-dark">{activity.activity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-dark mb-4">系统导航</h2>
          <div className="flex flex-wrap gap-4">
            {['场景管理', '模板库', '素材管理', '内容生成', '设置'].map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(['/scenes', '/templates', '/materials', '/generate', '/settings'][index])}
                className="px-4 py-2 border border-gray-200 rounded-md hover:border-primary hover:text-primary transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard