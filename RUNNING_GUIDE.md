# CRM智能营销素材生成系统 - 运行指南

## 系统架构

- **前端**: React + TypeScript + Tailwind CSS (端口: 3000)
- **后端**: Node.js + Express + MongoDB (端口: 8000)
- **AI集成**: OpenAI API

## 运行步骤

### 1. 环境准备

#### 安装必要软件
- **Node.js** (v16+): [https://nodejs.org/](https://nodejs.org/)
- **MongoDB** (v4.4+): [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

#### 克隆项目
```bash
git clone <项目地址>
cd crm-marketing-system
```

### 2. 后端配置

#### 安装依赖
```bash
cd backend
npm install
```

#### 配置环境变量
编辑 `.env` 文件:
```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/crm-marketing-system

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key  # 替换为真实的OpenAI API密钥
OPENAI_MODEL=gpt-3.5-turbo

# Security Configuration
RATE_LIMIT_WINDOW_MS=15 * 60 * 1000
RATE_LIMIT_MAX_REQUESTS=100
```

#### 启动MongoDB
确保MongoDB服务正在运行:
- Windows: 启动MongoDB服务
- macOS/Linux: `mongod`

#### 启动后端服务
```bash
# 开发模式 (带热重载)
npm run dev

# 生产模式
npm start
```

### 3. 前端配置

#### 安装依赖
```bash
cd ../frontend
npm install
```

#### 启动前端开发服务器
```bash
npm run dev
```

### 4. 访问应用

打开浏览器访问:
- **前端应用**: [http://localhost:3000](http://localhost:3000)
- **后端API**: [http://localhost:8000/api](http://localhost:8000/api)

### 5. 功能测试

#### 登录系统
- 系统会自动创建默认测试用户
- 用户名: `test@example.com`
- 密码: `password123`

#### 测试AI内容生成
1. 登录后进入「内容生成」页面
2. 选择营销场景
3. 填写相关参数
4. 点击「生成内容」按钮
5. 查看AI生成的营销内容

### 6. 项目结构

```
crm-marketing-system/
├── frontend/            # 前端项目
│   ├── src/
│   │   ├── pages/       # 页面组件
│   │   ├── components/  # 通用组件
│   │   └── services/    # API服务
│   └── package.json     # 前端依赖
├── backend/             # 后端项目
│   ├── src/
│   │   ├── models/      # 数据模型
│   │   ├── routes/      # API路由
│   │   └── middleware/  # 中间件
│   └── package.json     # 后端依赖
└── docs/                # 项目文档
```

### 7. 常见问题

#### MongoDB连接失败
- 检查MongoDB服务是否运行
- 检查连接字符串是否正确
- 尝试重启MongoDB服务

#### OpenAI API调用失败
- 确保API密钥正确
- 检查网络连接
- 查看API调用频率限制

#### 前端无法连接后端
- 检查后端服务是否运行
- 检查API代理配置
- 检查CORS设置

### 8. 部署建议

#### 开发环境
- 使用 `npm run dev` 启动前后端服务

#### 生产环境
1. 前端构建:
   ```bash
   cd frontend
   npm run build
   ```

2. 后端部署:
   - 使用PM2管理进程:
     ```bash
     npm install -g pm2
     pm2 start src/server.js
     ```

3. 环境变量配置:
   - 生产环境中使用真实的JWT密钥
   - 配置适当的CORS设置
   - 启用HTTPS

## 技术支持

如有任何问题，请参考项目文档或联系技术支持。