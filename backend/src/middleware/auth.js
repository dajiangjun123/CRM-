const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 验证JWT token
exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        error: {
          message: 'Access token required',
          status: 401
        }
      });
    }

    // 开发环境允许模拟token
    if (token === 'mock-token') {
      // 创建模拟用户
      req.user = {
        _id: '657d23b1c8e7f8a9b0c1d2e4',
        name: '管理员',
        email: 'test@example.com',
        role: 'admin',
        usageStats: {
          generationCount: 0
        }
      };
      next();
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        error: {
          message: 'Invalid token',
          status: 401
        }
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      error: {
        message: 'Invalid or expired token',
        status: 401
      }
    });
  }
};

// 验证管理员权限
exports.verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: {
        message: 'Access denied. Admin permission required',
        status: 403
      }
    });
  }
  next();
};

// 验证用户是否有权限访问资源
exports.verifyResourceAccess = (resourceOwnerField = 'createdBy') => {
  return (req, res, next) => {
    const resource = req.resource;
    
    if (!resource) {
      return res.status(404).json({
        error: {
          message: 'Resource not found',
          status: 404
        }
      });
    }

    const isOwner = resource[resourceOwnerField].toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: {
          message: 'Access denied. You do not have permission to access this resource',
          status: 403
        }
      });
    }

    next();
  };
};