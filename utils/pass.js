// check out https://github.com/visionmedia/node-pwd

/**
 * Module dependencies.
 */

var crypto = require('crypto');

/**
 * Bytesize.
 */

var len = 128;

/**
 * Iterations. ~300ms
 */

var iterations = 12000;

/**
 * Hashes a password with optional `salt`, otherwise
 * generate a salt for `pass` and invoke `fn(err, salt, hash)`.
 *
 * @param {String} password to hash
 * @param {String} optional salt
 * @param {Function} callback
 * @api public
 */

exports.hash = function (pwd, salt, fn) {
    if (3 == arguments.length) {
        //hash(pass, user.salt, function (err, hash) {
        //��������������ɹ�ϣֵ������   ����¼��    ��֤
        //���룬�Σ�����������ָ�����ȣ��ص�
        //�ص�����Ϊfunction(err,hash)
        crypto.pbkdf2(pwd, salt, iterations, len, fn);
    } else {
        //hash(userObj.password, function (err, salt, hash)
        //���ݱ������������ɵ������ɹ�ϣֵ������ ��ע�ᡱ �����ϣֵ��Userģ��
        //�ص����� fn(null, salt, hash);
        fn = salt;
        crypto.randomBytes(len, function (err, salt) {//����һ��������ȵ��ַ���
            if (err) return fn(err);
            salt = salt.toString('base64');
            crypto.pbkdf2(pwd, salt, iterations, len, function (err, hash) {
                if (err) return fn(err);
                fn(null, salt, hash);
            });
        });
    }
};
