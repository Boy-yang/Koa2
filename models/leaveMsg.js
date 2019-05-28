const mongoose = require('mongoose');

let leaveMsgSchema = new mongoose.Schema({
    author: String,//用户
    content: String,//内容
    datetime: String,//时间
    avatar: String,//头像   
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

leaveMsgSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
});

let LeaveMsg = mongoose.model('LeaveMsg', leaveMsgSchema);
module.exports = LeaveMsg;