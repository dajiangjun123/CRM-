const express = require('express');
const Scene = require('../models/Scene');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// 获取所有场景
router.get('/', verifyToken, async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    
    const query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const scenes = await Scene.find(query)
      .populate('createdBy', 'name username')
      .sort({ usageCount: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Scene.countDocuments(query);

    res.json({
      success: true,
      scenes,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: total
      }
    });
  } catch (error) {
    console.error('Get scenes error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// 获取单个场景
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const scene = await Scene.findById(id)
      .populate('createdBy', 'name username');
    
    if (!scene) {
      return res.status(404).json({
        error: {
          message: 'Scene not found',
          status: 404
        }
      });
    }

    res.json({
      success: true,
      scene
    });
  } catch (error) {
    console.error('Get scene error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// 创建场景
router.post('/', verifyToken, async (req, res) => {
  try {
    const sceneData = req.body;
    
    const scene = new Scene({
      ...sceneData,
      createdBy: req.user._id,
      updatedBy: req.user._id
    });

    await scene.save();

    await scene.populate('createdBy', 'name username');

    res.status(201).json({
      success: true,
      scene
    });
  } catch (error) {
    console.error('Create scene error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// 更新场景
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const scene = await Scene.findById(id);
    
    if (!scene) {
      return res.status(404).json({
        error: {
          message: 'Scene not found',
          status: 404
        }
      });
    }

    // 只有创建者或管理员可以更新
    if (scene.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        error: {
          message: 'Access denied. You can only update scenes you created',
          status: 403
        }
      });
    }

    updateData.updatedBy = req.user._id;

    const updatedScene = await Scene.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).populate('createdBy', 'name username');

    res.json({
      success: true,
      scene: updatedScene
    });
  } catch (error) {
    console.error('Update scene error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// 删除场景
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const scene = await Scene.findById(id);
    
    if (!scene) {
      return res.status(404).json({
        error: {
          message: 'Scene not found',
          status: 404
        }
      });
    }

    // 只有创建者或管理员可以删除
    if (scene.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        error: {
          message: 'Access denied. You can only delete scenes you created',
          status: 403
        }
      });
    }

    // 软删除
    await Scene.findByIdAndUpdate(id, { isActive: false });

    res.json({
      success: true,
      message: 'Scene deleted successfully'
    });
  } catch (error) {
    console.error('Delete scene error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// 更新场景使用次数
router.put('/:id/usage', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const scene = await Scene.findById(id);
    
    if (!scene) {
      return res.status(404).json({
        error: {
          message: 'Scene not found',
          status: 404
        }
      });
    }

    scene.usageCount += 1;
    await scene.save();

    res.json({
      success: true,
      scene: {
        id: scene._id,
        usageCount: scene.usageCount
      }
    });
  } catch (error) {
    console.error('Update scene usage error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

module.exports = router;