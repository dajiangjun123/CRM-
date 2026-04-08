const express = require('express');
const OpenAI = require('openai');
const GeneratedContent = require('../models/GeneratedContent');
const Scene = require('../models/Scene');
const Template = require('../models/Template');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// OpenAI客户端初始化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL
});

// 生成内容
router.post('/generate', verifyToken, async (req, res) => {
  try {
    const { sceneId, parameters, templateId } = req.body;

    if (!sceneId) {
      return res.status(400).json({
        error: {
          message: 'Scene ID is required',
          status: 400
        }
      });
    }

    // 获取场景信息（使用模拟数据避免MongoDB依赖）
    let scene;
    try {
      scene = await Scene.findById(sceneId);
      
      if (!scene) {
        // 使用模拟场景数据
        scene = {
          _id: sceneId,
          name: '产品营销场景',
          category: '营销',
          description: '用于生成产品营销文案',
          promptTemplate: `你是一个专业的营销文案专家，请为以下产品生成一份吸引人的营销文案：

产品名称：{{productName}}
目标客户：{{targetCustomer}}
核心卖点：{{keySellingPoints}}
风格要求：{{styleRequirements}}

请生成一份完整的营销文案，包括产品介绍、核心卖点、目标客户分析、营销话术等内容。`,
          usageCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }
    } catch (error) {
      // 如果MongoDB连接失败，使用模拟数据
      scene = {
        _id: sceneId,
        name: '产品营销场景',
        category: '营销',
        description: '用于生成产品营销文案',
        promptTemplate: `你是一个专业的营销文案专家，请为以下产品生成一份吸引人的营销文案：

产品名称：{{productName}}
目标客户：{{targetCustomer}}
核心卖点：{{keySellingPoints}}
风格要求：{{styleRequirements}}

请生成一份完整的营销文案，包括产品介绍、核心卖点、目标客户分析、营销话术等内容。`,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    // 更新场景使用次数（仅在有真实场景对象时）
    if (scene._id && typeof scene.save === 'function') {
      scene.usageCount += 1;
      await scene.save();
    }

    // 更新用户使用统计（仅在有真实用户对象时）
    if (req.user._id && typeof req.user.save === 'function') {
      try {
        const user = await User.findById(req.user._id);
        if (user && user.usageStats) {
          user.usageStats.generationCount += 1;
          await user.save();
        }
      } catch (error) {
        console.log('Failed to update user stats:', error);
      }
    }

    // 构建提示词
    let prompt = scene.promptTemplate;
    
    // 替换参数
    if (parameters) {
      Object.keys(parameters).forEach(key => {
        const placeholder = `{{${key}}}`;
        prompt = prompt.replace(new RegExp(placeholder, 'g'), parameters[key]);
      });
    }

    // 调用OpenAI API生成内容
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的营销内容生成助手，擅长创建高质量、专业的营销素材。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const generatedContent = completion.choices[0].message.content;

    // 创建生成内容对象（使用模拟数据避免MongoDB依赖）
    const content = {
      _id: `content_${Date.now()}`,
      title: parameters.productName || '生成的营销内容',
      content: generatedContent,
      contentType: '文案',
      sceneId: {
        _id: scene._id,
        name: scene.name,
        category: scene.category
      },
      templateId: templateId || null,
      parameters,
      createdBy: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email
      },
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 尝试保存到数据库（如果可用）
    try {
      const dbContent = new GeneratedContent({
        title: parameters.productName || '生成的营销内容',
        content: generatedContent,
        contentType: '文案',
        sceneId,
        templateId,
        parameters,
        createdBy: req.user._id
      });
      await dbContent.save();
    } catch (error) {
      console.log('Failed to save content to database:', error);
    }

    res.json({
      success: true,
      content
    });
  } catch (error) {
    console.error('Generate content error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// 获取生成内容列表
router.get('/', verifyToken, async (req, res) => {
  try {
    const { contentType, status, page = 1, limit = 10 } = req.query;
    
    const query = { createdBy: req.user._id };
    
    if (contentType) {
      query.contentType = contentType;
    }
    
    if (status) {
      query.status = status;
    }

    const contents = await GeneratedContent.find(query)
      .populate('sceneId', 'name category')
      .populate('templateId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await GeneratedContent.countDocuments(query);

    res.json({
      success: true,
      contents,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: total
      }
    });
  } catch (error) {
    console.error('Get contents error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// 获取单个生成内容
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const content = await GeneratedContent.findById(id)
      .populate('sceneId', 'name category')
      .populate('templateId', 'name')
      .populate('createdBy', 'name username');
    
    if (!content) {
      return res.status(404).json({
        error: {
          message: 'Content not found',
          status: 404
        }
      });
    }

    // 验证所有权
    if (content.createdBy._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        error: {
          message: 'Access denied',
          status: 403
        }
      });
    }

    res.json({
      success: true,
      content
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// 更新生成内容
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const content = await GeneratedContent.findById(id);
    
    if (!content) {
      return res.status(404).json({
        error: {
          message: 'Content not found',
          status: 404
        }
      });
    }

    // 验证所有权
    if (content.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        error: {
          message: 'Access denied',
          status: 403
        }
      });
    }

    updateData.updatedBy = req.user._id;

    const updatedContent = await GeneratedContent.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    })
      .populate('sceneId', 'name category')
      .populate('templateId', 'name')
      .populate('createdBy', 'name username');

    res.json({
      success: true,
      content: updatedContent
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// 删除生成内容
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const content = await GeneratedContent.findById(id);
    
    if (!content) {
      return res.status(404).json({
        error: {
          message: 'Content not found',
          status: 404
        }
      });
    }

    // 验证所有权
    if (content.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
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
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

module.exports = router;