import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobal } from '../contexts/GlobalContext'

const Login = () => {
  const { addMessage, showLoading, hideLoading } = useGlobal()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.username || !formData.password) {
      addMessage({
        type: 'warning',
        content: '请输入账号和密码'
      })
      return
    }

    showLoading('login', '登录中...')
    setIsLoading(true)

    try {
      // 模拟登录逻辑
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (formData.username === 'test@example.com' && formData.password === 'password123') {
        localStorage.setItem('token', 'mock-token')
        addMessage({
          type: 'success',
          content: '登录成功！'
        })
        navigate('/dashboard')
      } else {
        addMessage({
          type: 'error',
          content: '账号或密码错误'
        })
      }
    } catch (error) {
      addMessage({
        type: 'error',
        content: '登录失败，请稍后重试'
      })
      console.error('登录失败:', error)
    } finally {
      hideLoading('login')
      setIsLoading(false)
    }
  }

  return (<div className="min-h-screen flex items-center justify-center bg-light-bg p-4"><div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8"><div className="text-center mb-8"><h1 className="text-2xl font-bold text-dark mb-2">CRM智能营销素材生成系统</h1><p className="text-dark-gray">欢迎登录</p></div><form onSubmit={handleSubmit} className="space-y-4"><div><label htmlFor="username" className="block text-sm font-medium text-dark mb-1">账号</label><input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="请输入账号"
          /></div><div><label htmlFor="password" className="block text-sm font-medium text-dark mb-1">密码</label><input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="请输入密码"
          /></div><div className="flex items-center justify-between"><a href="#" className="text-sm text-primary hover:underline">忘记密码？</a></div><button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >{isLoading ? '登录中...' : '登录'}</button><div className="text-center mt-4"><p className="text-sm text-dark-gray">还没有账号？<a href="#" className="text-primary hover:underline">立即注册</a></p></div></form></div></div>)
}

export default Login