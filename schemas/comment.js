var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
/**
 * 评论功能：movie(电影ID) from(评论人ID) content(评论内容)
 * 回复功能：movie(电影ID) from(评论人ID) content(评论内容) replay[](回复队列)
 * replay[] 回复队列 ：每个主评论可能会更随若干个从评论：from(从评论评论人ID) content(评论内容) to(主评论评论人)
 * 从评论被push()进入主评论的replay数组中
 */

var CommentSchema = new mongoose.Schema({
    movie:{
        type:ObjectId,
        ref:'Movie'
    },
    from:{
        type:ObjectId,
        ref:'User'
    },
    //回复功能的数据结构
    reply:[{
        from:{type:ObjectId,ref:'User'},
        to:{type:ObjectId,ref:'User'},
        content:String
    }],
    content:String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});
CommentSchema.pre('save',function(next){
    if (this.isNew) {
        this.meta.updateAt = this.meta.createAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next()
});

CommentSchema.statics = {
    fetch: function (cb) {
        return this.find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function (id,cb) {
        return this.findOne({_id: id})
            .sort('meta.updateAt')
            .exec(cb);
    }
};

module.exports = CommentSchema;