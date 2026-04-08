const mongoose = require('mongoose');

const generatedContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '内容标题不能为空'],
    trim: true,
    maxlength: [200, '标题最多200个字符']
  },
  content: {
    type: String,
    required: [true, '内容不能为空']
  },
  contentType: {
    type: String,
    required: [true, '内容类型不能为空'],
    enum: ['文案', '话术', '邮件', '短信', '社交媒体', '海报', '文档']
  },
  sceneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scene',
    required: true
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template'
  },
  parameters: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  wordCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'saved', 'published', 'archived'],
    default: 'draft'
  },
  tags: [String],
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// 更新时间戳
generatedContentSchema.pre('updateOne', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

// 计算字数
generatedContentSchema.pre('save', function(next) {
  if (this.content) {
    this.wordCount = this.content.trim().split(/\s+/).length;
  }
  next();
});

const GeneratedContent = mongoose.model('GeneratedContent', generatedContentSchema);

module.exports = GeneratedContent;