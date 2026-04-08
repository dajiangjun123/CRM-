const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// 用户登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: {
          message: 'Username and password are required',
          status: 400
        }
      });
    }

    const user = await User.findOne({ username }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        error: {
          message: 'Invalid username or password',
          status: 401
        }
      });
    }

    // 更新最后登录时间
    user.usageStats.lastLogin = new Date();
    await user.save();

    // 生成JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// 用户注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, name, company } = req.body;

    // 验证必填字段
    if (!username || !email || !password || !name) {
      return res.status(400).json({
        error: {
          message: 'Username, email, password, and name are required',
          status: 400
        }
      });
    }

    // 检查用户名是否已存在
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({
        error: {
          message: 'Username or email already exists',
          status: 400
        }
      });
    }

    // 创建新用户
    const user = new User({
      username,
      email,
      password,
      name,
      company
    });

    await user.save();

    // 生成JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// 获取当前用户信息
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        error: {
          message: 'User not found',
          status: 404
        }
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        settings: user.settings,
        usageStats: user.usageStats
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// 刷新token
router.post('/refresh', verifyToken, async (req, res) => {
  try {
    const token = jwt.sign(
      { id: req.user._id, username: req.user.username, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      token
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

module.exports = router;