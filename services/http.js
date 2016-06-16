/**
 * 封装request请求，将callback方式改为promise的方式
 * options参数参考request库
 * https://github.com/request/request
 */
var when = require('when');
var request = require('request');
var _ = require('underscore');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var http = {
  /**
   * 默认选项
   * @param options
   * @param method
   * @returns {*|{}}
   */
	getOptions:function(options,method){
    var result = options || {};
		if(_.isString(options)){
      result = {
				uri:options,
				method:method,
        timeout:15000
			};
		}
    result.uri = encodeURI(result.uri);
    /*if(result.uri.indexOf('https') >= 0){
      // https请求需要设置
      // https://github.com/request/request#tlsssl-protocol
      result.agentOptions = {
        secureProtocol: 'SSLv3_method'
      }
    }*/
    result.method = method;
    result.timeout = 15000;
    console.log(result);
		return result;
	},
  /**
   * 请求入口，封装Promise调用
   * @param options 参考：https://github.com/request/request#requestoptions-callback
   * @returns {*}
   */
	request:function(options){
		console.log( options);
		var deferred = when.defer();
		var resolver = deferred.resolver;
		request(options,function(err,response,body){
			if(!err && response.statusCode == 200){
				resolver.resolve(body);
			}else{
				resolver.reject(err);
			}
		});
		return deferred.promise;
	},

  /**
   * get suger方法
   * @returns {*} request promise
   */
	get:function(options){
		options = this.getOptions(options,'GET');
		return this.request(options);
	},

  /**
   * get json suger方法
   * @returns {*} request promise
   */
	getJson:function(options){
		return this.get(options).then(function(body){
      //console.log('@@@@@@@@@@@@@@@@@@@@#$$$')
      //console.log(body)
			return JSON.parse(body);
		});
	},
  /**
   * post suger方法
   * @returns {*} request promise
   */
	post:function(options,form){
		options = this.getOptions(options,'POST');
    options.form = form;
		return this.request(options);
	},
  /**
   * post json suger方法
   * @returns {*} request promise
   */
	postJson:function(options,form){
		return this.post(options,form).then(function(body){
			return JSON.parse(body);
		});
	}
};

module.exports = http;
