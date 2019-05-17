const mongoose = require('mongoose');

let articleSchema = new mongoose.Schema({
    title: String,//文章标题
    content: String,//文章内容
    time: String,//发表时间
    viewCount: Number,//浏览次数
    commentCount: Number,//评论次数
    coverImg: String,//封面图片
    author: String,//作者
    tags: Array,//标签
    isPublish: Boolean,//是否发布
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

articleSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
});

let Article = mongoose.model('Article', articleSchema);
module.exports = Article;