const mongoose = require('mongoose');
let UserSchema = new mongoose.Schema({
    username: {
        unique:true,
        type:String
    },
    phoneNumber: Number,
    password: String,
    verifyCode: String,//验证码
    areaCode: String,
    verified: {
        type: Boolean,
        default: false
    },
    accessToken: String,
    age: String,
    avatar: String,
    meta: {
        createAt: {
            type: Date,
            dafault: Date.now()
        },
        updateAt: {
            type: Date,
            dafault: Date.now()
        }
    }
});

// Defines a pre hook for the document.
UserSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
});

// 参数User为数据库中的集合名称, 不存在会创建.
let User = mongoose.model('User', UserSchema);
module.exports = User;