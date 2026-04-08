import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Settings = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('personal')

  const tabs = [
    { id: 'personal', name: '个人信息' },
    { id: 'api', name: 'API密钥' },
    { id: 'system', name: '系统配置' },
    { id: 'notification', name: '通知设置' },
    { id: 'security', name: '安全设置' },
    { id: 'help', name: '帮助中心' }
  ]

  const [formData, setFormData] = useState({
    personal: {
      name: '管理员',
      email: 'admin@example.com',
      company: '示例公司'
    },
    system: {
      darkMode: false,
      autoSave: true
    },
    notification: {
      email: true,
      sms: false
    },
    security: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleChange = (tab: string, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleSavePersonal = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      showMessage('success', '个人信息保存成功')
    } catch (error) {
      showMessage('error', '保存失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSystem = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      showMessage('success', '系统配置保存成功')
    } catch (error) {
      showMessage('error', '保存失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNotification = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      showMessage('success', '通知设置保存成功')
    } catch (error) {
      showMessage('error', '保存失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSecurity = async () => {
    if (!formData.security.currentPassword || !formData.security.newPassword || !formData.security.confirmPassword) {
      showMessage('error', '请填写所有密码字段')
      return
    }

    if (formData.security.newPassword !== formData.security.confirmPassword) {
      showMessage('error', '新密码和确认密码不一致')
      return
    }

    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      showMessage('success', '密码修改成功')
      setFormData(prev => ({
        ...prev,
        security: {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      }))
    } catch (error) {
      showMessage('error', '修改失败，请检查当前密码是否正确')
    } finally {
      setLoading(false)
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
            <h1 className="text-xl font-semibold text-dark">设置中心</h1>
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
              <h2 className="text-lg font-semibold text-dark mb-4">设置菜单</h2>
              <div className="space-y-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'hover:bg-light-gray'
                    }`}
                  >{tab.name}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {message && (
                <div className={`mb-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {message.text}
                </div>
              )}

              {activeTab === 'personal' && (
                <>
                  <h2 className="text-lg font-semibold text-dark mb-4">个人信息设置</h2>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-dark mb-1">姓名</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.personal.name}
                        onChange={(e) => handleChange('personal', 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="请输入姓名"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-dark mb-1">邮箱</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.personal.email}
                        onChange={(e) => handleChange('personal', 'email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="请输入邮箱"
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-dark mb-1">公司</label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.personal.company}
                        onChange={(e) => handleChange('personal', 'company', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="请输入公司名称"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSavePersonal}
                      disabled={loading}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >{loading ? '保存中...' : '保存修改'}</button>
                  </form>
                </>
              )}

              {activeTab === 'api' && (
                <>
                  <h2 className="text-lg font-semibold text-dark mb-4">API密钥管理</h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-light-gray rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-dark">API密钥</span>
                        <button className="text-primary hover:text-blue-600 text-sm">刷新</button>
                      </div>
                      <div className="p-2 bg-white rounded border border-gray-200 font-mono text-sm overflow-x-auto">sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</div>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-light-gray transition-colors">创建新密钥</button>
                  </div>
                </>
              )}

              {activeTab === 'system' && (
                <>
                  <h2 className="text-lg font-semibold text-dark mb-4">系统配置</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-dark">深色模式</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formData.system.darkMode}
                          onChange={(e) => handleChange('system', 'darkMode', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-dark">自动保存</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formData.system.autoSave}
                          onChange={(e) => handleChange('system', 'autoSave', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveSystem}
                      disabled={loading}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >{loading ? '保存中...' : '保存配置'}</button>
                  </div>
                </>
              )}

              {activeTab === 'notification' && (
                <>
                  <h2 className="text-lg font-semibold text-dark mb-4">通知设置</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-dark">邮件通知</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formData.notification.email}
                          onChange={(e) => handleChange('notification', 'email', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-dark">短信通知</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formData.notification.sms}
                          onChange={(e) => handleChange('notification', 'sms', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveNotification}
                      disabled={loading}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >{loading ? '保存中...' : '保存设置'}</button>
                  </div>
                </>
              )}

              {activeTab === 'security' && (
                <>
                  <h2 className="text-lg font-semibold text-dark mb-4">安全设置</h2>
                  <div className="space-y-4">
                    <div className="bg-light-gray p-4 rounded-lg">
                      <h3 className="font-medium text-dark mb-3">修改密码</h3>
                      <div className="space-y-3">
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-dark mb-1">当前密码</label>
                          <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.security.currentPassword}
                            onChange={(e) => handleChange('security', 'currentPassword', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="请输入当前密码"
                          />
                        </div>
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-dark mb-1">新密码</label>
                          <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.security.newPassword}
                            onChange={(e) => handleChange('security', 'newPassword', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="请输入新密码"
                          />
                        </div>
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark mb-1">确认新密码</label>
                          <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.security.confirmPassword}
                            onChange={(e) => handleChange('security', 'confirmPassword', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="请再次输入新密码"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleSaveSecurity}
                          disabled={loading}
                          className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >{loading ? '修改中...' : '修改密码'}</button>
                      </div>
                    </div>
                    <div><button className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-light-gray transition-colors text-left">登录设备管理</button></div>
                    <div><button className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-light-gray transition-colors text-left">隐私设置</button></div>
                  </div>
                </>
              )}

              {activeTab === 'help' && (
                <>
                  <h2 className="text-lg font-semibold text-dark mb-4">帮助中心</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-dark mb-2">常见问题</h3>
                      <div className="space-y-2">
                        <button className="w-full text-left text-primary hover:text-blue-600">如何使用系统？</button>
                        <button className="w-full text-left text-primary hover:text-blue-600">如何生成高质量内容？</button>
                        <button className="w-full text-left text-primary hover:text-blue-600">如何管理团队成员？</button>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-dark mb-2">联系支持</h3>
                      <p className="text-dark-gray">如有问题，请联系客服：support@example.com</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings