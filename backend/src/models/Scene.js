const mongoose = require('mongoose');

const sceneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '场景名称不能为空'],
    trim: true,
    maxlength: [100, '场景名称最多100个字符']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, '场景描述最多500个字符']
  },
  category: {
    type: String,
    required: [true, '场景分类不能为空'],
    enum: ['销售场景', '营销场景', '客服场景', '社交媒体', '产品推广', '活动策划']
  },
  parameters: [
    {
      name: {
        type: String,
        required: [true, '参数名称不能为空'],
        trim: true
      },
      type: {
        type: String,
        required: [true, '参数类型不能为空'],
        enum: ['text', 'textarea', 'select', 'checkbox', 'number']
      },
      label: {
        type: String,
        required: [true, '参数标签不能为空'],
        trim: true
      },
      placeholder: {
        type: String,
        trim: true
      },
      required: {
        type: Boolean,
        default: false
      },
      options: [String],
      defaultValue: {
        type: String
      }
    }
  ],
  promptTemplate: {
    type: String,
    required: [true, '提示词模板不能为空']
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
sceneSchema.pre('updateOne', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

const Scene = mongoose.model('Scene', sceneSchema);

module.exports = Scene;