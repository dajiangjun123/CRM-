const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '模板名称不能为空'],
    trim: true,
    maxlength: [100, '模板名称最多100个字符']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, '模板描述最多500个字符']
  },
  category: {
    type: String,
    required: [true, '模板分类不能为空'],
    enum: ['邮件模板', '短信模板', '话术模板', '海报模板', '推文模板', '活动模板']
  },
  content: {
    type: String,
    required: [true, '模板内容不能为空']
  },
  variables: [
    {
      name: {
        type: String,
        required: [true, '变量名称不能为空'],
        trim: true
      },
      label: {
        type: String,
        required: [true, '变量标签不能为空'],
        trim: true
      },
      type: {
        type: String,
        required: [true, '变量类型不能为空'],
        enum: ['text', 'textarea', 'select', 'date']
      },
      required: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        trim: true
      },
      options: [String]
    }
  ],
  preview: {
    type: String
  },
  usageCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
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
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// 更新时间戳
templateSchema.pre('updateOne', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

const Template = mongoose.model('Template', templateSchema);

module.exports = Template;