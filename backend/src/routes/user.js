const express = require('express');
const User = require('../models/User');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// 获取所有用户（管理员）
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// 获取单个用户
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // 普通用户只能查看自己的信息
    if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
      return res.status(403).json({
        error: {
          message: 'Access denied. You can only view your own profile',
          status: 403
        }
      });
    }

    const user = await User.findById(id).select('-password');
    
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
      user
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

// 更新用户信息
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // 普通用户只能更新自己的信息
    if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
      return res.status(403).json({
        error: {
          message: 'Access denied. You can only update your own profile',
          status: 403
        }
      });
    }

    // 不允许普通用户修改角色
    if (req.user.role !== 'admin' && updateData.role) {
      return res.status(403).json({
        error: {
          message: 'Access denied. You cannot change user role',
          status: 403
        }
      });
    }

    // 删除敏感字段
    delete updateData.password;
    delete updateData.username;

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).select('-password');
    
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
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// 删除用户（管理员）
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // 不能删除自己
    if (req.user._id.toString() === id) {
      return res.status(400).json({
        error: {
          message: 'Cannot delete your own account',
          status: 400
        }
      });
    }

    const user = await User.findByIdAndDelete(id);
    
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
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// 更新用户密码
router.put('/:id/password', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    // 普通用户只能更新自己的密码
    if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
      return res.status(403).json({
        error: {
          message: 'Access denied. You can only update your own password',
          status: 403
        }
      });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: {
          message: 'Current password and new password are required',
          status: 400
        }
      });
    }

    const user = await User.findById(id).select('+password');
    
    if (!user) {
      return res.status(404).json({
        error: {
          message: 'User not found',
          status: 404
        }
      });
    }

    // 验证当前密码
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({
        error: {
          message: 'Current password is incorrect',
          status: 401
        }
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

module.exports = router;