const express = require('express');
const GeneratedContent = require('../models/GeneratedContent');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// 获取素材列表
router.get('/', verifyToken, async (req, res) => {
  try {
    const { contentType, status, tag, search, page = 1, limit = 10 } = req.query;
    
    const query = { createdBy: req.user._id };
    
    if (contentType) {
      query.contentType = contentType;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (tag) {
      query.tags = tag;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const materials = await GeneratedContent.find(query)
      .populate('sceneId', 'name category')
      .populate('templateId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await GeneratedContent.countDocuments(query);

    res.json({
      success: true,
      materials,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: total
      }
    });
  } catch (error) {
    console.error('Get materials error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// 获取单个素材
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const material = await GeneratedContent.findById(id)
      .populate('sceneId', 'name category')
      .populate('templateId', 'name')
      .populate('createdBy', 'name username');
    
    if (!material) {
      return res.status(404).json({
        error: {
          message: 'Material not found',
          status: 404
        }
      });
    }

    // 验证所有权
    if (material.createdBy._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        error: {
          message: 'Access denied',
          status: 403
        }
      });
    }

    res.json({
      success: true,
      material
    });
  } catch (error) {
    console.error('Get material error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// 更新素材
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const material = await GeneratedContent.findById(id);
    
    if (!material) {
      return res.status(404).json({
        error: {
          message: 'Material not found',
          status: 404
        }
      });
    }

    // 验证所有权
    if (material.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        error: {
          message: 'Access denied',
          status: 403
        }
      });
    }

    updateData.updatedBy = req.user._id;

    const updatedMaterial = await GeneratedContent.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    })
      .populate('sceneId', 'name category')
      .populate('templateId', 'name')
      .populate('createdBy', 'name username');

    res.json({
      success: true,
      material: updatedMaterial
    });
  } catch (error) {
    console.error('Update material error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// 删除素材
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const material = await GeneratedContent.findById(id);
    
    if (!material) {
      return res.status(404).json({
        error: {
          message: 'Material not found',
          status: 404
        }
      });
    }

    // 验证所有权
    if (material.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        error: {
          message: 'Access denied',
          status: 403
        }
      });
    }

    await GeneratedContent.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Material deleted successfully'
    });
  } catch (error) {
    console.error('Delete material error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// 批量删除素材
router.delete('/', verifyToken, async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        error: {
          message: 'Material IDs array is required',
          status: 400
        }
      });
    }

    // 验证所有权
    const materials = await GeneratedContent.find({
      _id: { $in: ids },
      createdBy: req.user._id
    });

    if (materials.length !== ids.length) {
      return res.status(403).json({
        error: {
          message: 'Access denied to some materials',
          status: 403
        }
      });
    }

    await GeneratedContent.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      message: `${ids.length} materials deleted successfully`
    });
  } catch (error) {
    console.error('Batch delete materials error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// 导出素材
router.post('/:id/export', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { format = 'markdown' } = req.body;
    
    const material = await GeneratedContent.findById(id);
    
    if (!material) {
      return res.status(404).json({
        error: {
          message: 'Material not found',
          status: 404
        }
      });
    }

    // 验证所有权
    if (material.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        error: {
          message: 'Access denied',
          status: 403
        }
      });
    }

    let content = material.content;
    let contentType = 'text/markdown';
    let fileExtension = 'md';

    if (format === 'txt') {
      contentType = 'text/plain';
      fileExtension = 'txt';
    } else if (format === 'html') {
      content = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${material.title}</title></head><body>${content}</body></html>`;
      contentType = 'text/html';
      fileExtension = 'html';
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${material.title}.${fileExtension}"`);
    res.send(content);
  } catch (error) {
    console.error('Export material error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// 更新素材状态
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        error: {
          message: 'Status is required',
          status: 400
        }
      });
    }

    const material = await GeneratedContent.findById(id);
    
    if (!material) {
      return res.status(404).json({
        error: {
          message: 'Material not found',
          status: 404
        }
      });
    }

    // 验证所有权
    if (material.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        error: {
          message: 'Access denied',
          status: 403
        }
      });
    }

    const updatedMaterial = await GeneratedContent.findByIdAndUpdate(
      id,
      { status, updatedBy: req.user._id },
      { new: true }
    );

    res.json({
      success: true,
      material: {
        id: updatedMaterial._id,
        status: updatedMaterial.status
      }
    });
  } catch (error) {
    console.error('Update material status error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

module.exports = router;