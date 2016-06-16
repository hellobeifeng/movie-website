var mongoose = require('mongoose');
/**
 * ��Ȼ��password���ԣ�����û�б���
 * ��ݿ���洢���Ǽ��ܺ�Ĺ�ϣֵ
 * ��¼ʱ���� password+salt->hash��֤��ϣֵ
 */
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    salt: String,
    hash: String,//密码加盐hash后的值
    role:{
        type:Number,
        default:0
    },
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
UserSchema.pre('save',function(next){
    if (this.isNew) {
        this.meta.updateAt = this.meta.createAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next()
});

UserSchema.statics = {
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

module.exports = UserSchema;