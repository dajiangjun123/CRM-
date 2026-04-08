const express = require('express');
const Template = require('../models/Template');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// 获取所有模板
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

    const templates = await Template.find(query)
      .populate('createdBy', 'name username')
      .sort({ usageCount: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Template.countDocuments(query);

    res.json({
      success: true,
      templates,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: total
      }
    });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// 获取单个模板
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const template = await Template.findById(id)
      .populate('createdBy', 'name username');
    
    if (!template) {
      return res.status(404).json({
        error: {
          message: 'Template not found',
          status: 404
        }
      });
    }

    res.json({
      success: true,
      template
    });
  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// 创建模板
router.post('/', verifyToken, async (req, res) => {
  try {
    const templateData = req.body;
    
    const template = new Template({
      ...templateData,
      createdBy: req.user._id,
      updatedBy: req.user._id
    });

    await template.save();

    await template.populate('createdBy', 'name username');

    res.status(201).json({
      success: true,
      template
    });
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// 更新模板
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const template = await Template.findById(id);
    
    if (!template) {
      return res.status(404).json({
        error: {
          message: 'Template not found',
          status: 404
        }
      });
    }

    // 只有创建者或管理员可以更新
    if (template.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        error: {
          message: 'Access denied. You can only update templates you created',
          status: 403
        }
      });
    }

    updateData.updatedBy = req.user._id;

    const updatedTemplate = await Template.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).populate('createdBy', 'name username');

    res.json({
      success: true,
      template: updatedTemplate
    });
  } catch (error) {
    console.error('Update template error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// 删除模板
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const template = await Template.findById(id);
    
    if (!template) {
      return res.status(404).json({
        error: {
          message: 'Template not found',
          status: 404
        }
      });
    }

    // 只有创建者或管理员可以删除
    if (template.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        error: {
          message: 'Access denied. You can only delete templates you created',
          status: 403
        }
      });
    }

    // 软删除
    await Template.findByIdAndUpdate(id, { isActive: false });

    res.json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// 更新模板使用次数
router.put('/:id/usage', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const template = await Template.findById(id);
    
    if (!template) {
      return res.status(404).json({
        error: {
          message: 'Template not found',
          status: 404
        }
      });
    }

    template.usageCount += 1;
    await template.save();

    res.json({
      success: true,
      template: {
        id: template._id,
        usageCount: template.usageCount
      }
    });
  } catch (error) {
    console.error('Update template usage error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

module.exports = router;